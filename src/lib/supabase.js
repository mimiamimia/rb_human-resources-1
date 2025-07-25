import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas corretamente')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Configurações do bucket
const BUCKET_CONFIG = {
    name: 'curriculos',
    options: {
        public: true,
        allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        fileSizeLimit: 10485760 // 10MB em bytes
    }
}

// Função para criar bucket se não existir
export const createBucketIfNotExists = async (bucketName = BUCKET_CONFIG.name) => {
    try {
        console.log(`Verificando se bucket '${bucketName}' existe...`)
        
        // Primeiro, listar todos os buckets
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()
        
        if (listError) {
            console.error('Erro ao listar buckets:', listError)
            throw listError
        }

        // Verificar se o bucket já existe
        const bucketExists = buckets.some(bucket => bucket.name === bucketName)
        
        if (bucketExists) {
            console.log(`Bucket '${bucketName}' já existe`)
            return { success: true, message: 'Bucket já existe' }
        }

        // Criar o bucket se não existir
        console.log(`Criando bucket '${bucketName}'...`)
        const { data, error } = await supabase.storage.createBucket(bucketName, BUCKET_CONFIG.options)

        if (error) {
            console.error('Erro ao criar bucket:', error)
            
            // Se o erro for de permissão, dar instruções
            if (error.message.includes('permission') || error.message.includes('policy')) {
                throw new Error(
                    'Erro de permissão ao criar bucket. Verifique se:\n' +
                    '1. Você tem permissões de administrador no projeto\n' +
                    '2. As políticas RLS estão configuradas corretamente\n' +
                    '3. A chave API tem permissões adequadas'
                )
            }
            
            throw error
        }

        console.log(`Bucket '${bucketName}' criado com sucesso:`, data)
        return { success: true, message: 'Bucket criado com sucesso', data }

    } catch (error) {
        console.error('Erro na função createBucketIfNotExists:', error)
        return { success: false, error }
    }
}

// Função para verificar se o bucket existe
// Versão melhorada da função ensureBucketExists
export const ensureBucketExists = async (bucketName = BUCKET_CONFIG.name) => {
    try {
        console.log(`Verificando bucket '${bucketName}'...`);
        
        // Primeiro, tentar fazer uma operação simples no bucket para verificar se existe
        const { data: testList, error: testError } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 1 });

        // Se não houve erro, o bucket existe
        if (!testError) {
            console.log(`Bucket '${bucketName}' existe e está acessível`);
            return true;
        }

        // Se o erro indica que o bucket não existe, tentar listar todos os buckets
        if (testError.message.includes('not found') || testError.message.includes('does not exist')) {
            console.log('Bucket não encontrado, listando buckets disponíveis...');
            
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();
            
            if (listError) {
                console.error('Erro ao listar buckets:', listError);
                return false;
            }

            console.log('Buckets disponíveis:', buckets.map(b => b.name));
            
            const bucketExists = buckets.some(bucket => bucket.name === bucketName);
            
            if (!bucketExists) {
                console.warn(`Bucket '${bucketName}' não encontrado na lista.`);
                
                // Tentar criar o bucket automaticamente
                console.log('Tentando criar bucket automaticamente...');
                const createResult = await createBucketIfNotExists(bucketName);
                
                if (createResult.success) {
                    console.log('Bucket criado automaticamente com sucesso!');
                    return true;
                } else {
                    console.error('Falha ao criar bucket automaticamente:', createResult.error);
                    return false;
                }
            }

            return true;
        }

        // Outros tipos de erro
        console.error('Erro inesperado ao verificar bucket:', testError);
        return false;
        
    } catch (error) {
        console.error('Erro ao verificar bucket:', error);
        return false;
    }
};

// Função melhorada para upload de arquivos
export const uploadFile = async (file, bucket = BUCKET_CONFIG.name, path) => {
    try {
        // Validação dos parâmetros
        if (!file || !bucket || !path) {
            throw new Error('Parâmetros obrigatórios não fornecidos para upload (file, bucket, path)')
        }

        // Validação do tipo de arquivo
        if (!BUCKET_CONFIG.options.allowedMimeTypes.includes(file.type)) {
            throw new Error(`Tipo de arquivo não permitido: ${file.type}. Tipos aceitos: ${BUCKET_CONFIG.options.allowedMimeTypes.join(', ')}`)
        }

        // Validação do tamanho do arquivo
        if (file.size > BUCKET_CONFIG.options.fileSizeLimit) {
            const sizeInMB = (BUCKET_CONFIG.options.fileSizeLimit / (1024 * 1024)).toFixed(1)
            throw new Error(`Arquivo muito grande: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Tamanho máximo: ${sizeInMB}MB`)
        }

        // Verificar se o bucket existe antes do upload
        const bucketExists = await ensureBucketExists(bucket)
        if (!bucketExists) {
            throw new Error(`Bucket '${bucket}' não está disponível para upload`)
        }

        // Log para debug
        console.log('Iniciando upload:', { 
            bucket, 
            path, 
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`, 
            fileType: file.type,
            fileName: file.name
        })

        // Realizar o upload
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false, // Não sobrescrever arquivo existente
                contentType: file.type
            })

        if (error) {
            console.error('Erro detalhado do upload:', error)
            
            // Tratamento de erros específicos
            if (error.message.includes('already exists')) {
                throw new Error('Um arquivo com este nome já existe. Tente novamente.')
            } else if (error.message.includes('policy')) {
                throw new Error('Erro de permissão no upload. Verifique as políticas do bucket.')
            } else if (error.message.includes('size')) {
                throw new Error('Arquivo muito grande ou bucket sem espaço.')
            }
            
            throw error
        }

        console.log('Upload realizado com sucesso:', data)
        return data
        
    } catch (error) {
        console.error('Erro no upload:', error)
        throw error
    }
}

// Função para obter URL pública do arquivo
export const getPublicUrl = (bucket = BUCKET_CONFIG.name, path) => {
    try {
        if (!bucket || !path) {
            throw new Error('Bucket e path são obrigatórios para obter URL pública')
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        if (!data || !data.publicUrl) {
            throw new Error('Não foi possível gerar URL pública')
        }

        console.log('URL pública gerada:', data.publicUrl)
        return data.publicUrl
        
    } catch (error) {
        console.error('Erro ao obter URL pública:', error)
        throw error
    }
}

// Função para deletar arquivo
export const deleteFile = async (bucket = BUCKET_CONFIG.name, path) => {
    try {
        if (!bucket || !path) {
            throw new Error('Bucket e path são obrigatórios para deletar arquivo')
        }

        const { data, error } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (error) {
            console.error('Erro ao deletar arquivo:', error)
            throw error
        }

        console.log('Arquivo deletado com sucesso:', data)
        return data
        
    } catch (error) {
        console.error('Erro ao deletar arquivo:', error)
        throw error
    }
}

// Função para listar arquivos no bucket
export const listFiles = async (bucket = BUCKET_CONFIG.name, folder = '') => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(folder)

        if (error) {
            console.error('Erro ao listar arquivos:', error)
            throw error
        }

        return data
        
    } catch (error) {
        console.error('Erro ao listar arquivos:', error)
        throw error
    }
}

// Função de inicialização do storage
export const initializeStorage = async () => {
    try {
        console.log('Inicializando configuração do storage...')
        
        // Verificar se o bucket principal existe
        const bucketReady = await ensureBucketExists()
        
        if (bucketReady) {
            console.log('✅ Storage inicializado com sucesso!')
            return { success: true, message: 'Storage pronto para uso' }
        } else {
            console.error('❌ Falha na inicialização do storage')
            return { success: false, message: 'Bucket não está disponível' }
        }
        
    } catch (error) {
        console.error('Erro na inicialização do storage:', error)
        return { success: false, error }
    }
}

// Services para Candidatos (mantidos iguais)
export const candidateService = {
    // Criar candidato
    async create(candidateData) {
        try {
            // Validação dos dados obrigatórios
            if (!candidateData.nome || !candidateData.email) {
                throw new Error('Nome e email são campos obrigatórios')
            }

            console.log('Criando candidato com dados:', candidateData)

            const { data, error } = await supabase
                .from('candidates')
                .insert([candidateData])
                .select()
                .single()

            if (error) {
                console.error('Erro detalhado ao criar candidato:', error)
                throw error
            }

            console.log('Candidato criado com sucesso:', data)
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao criar candidato:', error)
            return { data: null, error }
        }
    },

    // Buscar todos os candidatos
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao buscar candidatos:', error)
            return { data: null, error }
        }
    },

    // Buscar candidato por ID
    async getById(id) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório')
            }

            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao buscar candidato:', error)
            return { data: null, error }
        }
    },

    // Filtrar candidatos por área de interesse
    async getByArea(area) {
        try {
            if (!area) {
                throw new Error('Área é obrigatória')
            }

            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .eq('area_interesse', area)
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao filtrar candidatos:', error)
            return { data: null, error }
        }
    },

    // Atualizar candidato
    async update(id, updates) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório')
            }

            if (!updates || Object.keys(updates).length === 0) {
                throw new Error('Dados para atualização são obrigatórios')
            }

            const { data, error } = await supabase
                .from('candidates')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao atualizar candidato:', error)
            return { data: null, error }
        }
    },

    // Deletar candidato
    async delete(id) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório')
            }

            const { error } = await supabase
                .from('candidates')
                .delete()
                .eq('id', id)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Erro ao deletar candidato:', error)
            return { error }
        }
    }
}

// Services para Contatos de Empresas (mantidos iguais)
export const companyContactService = {
    // Criar contato de empresa
    async create(contactData) {
        try {
            if (!contactData.nome || !contactData.email) {
                throw new Error('Nome e email são campos obrigatórios')
            }

            const { data, error } = await supabase
                .from('company_contacts')
                .insert([contactData])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao criar contato de empresa:', error)
            return { data: null, error }
        }
    },

    // Buscar todos os contatos de empresas
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('company_contacts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao buscar contatos de empresas:', error)
            return { data: null, error }
        }
    },

    // Marcar contato como respondido
    async markAsAnswered(id, notes = '') {
        try {
            if (!id) {
                throw new Error('ID é obrigatório')
            }

            const { data, error } = await supabase
                .from('company_contacts')
                .update({ 
                    status: 'respondido',
                    notes: notes,
                    answered_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro ao marcar contato como respondido:', error)
            return { data: null, error }
        }
    }
}

// Exportar configurações para debug
export const STORAGE_CONFIG = BUCKET_CONFIG