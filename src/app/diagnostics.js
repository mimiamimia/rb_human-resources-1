// diagnostics.js - Execute no console do navegador ou como script Node.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 DIAGNÓSTICO DE PERMISSÕES SUPABASE')
console.log('=====================================')

async function diagnosticPermissions() {
    console.log('📋 Informações básicas:')
    console.log('URL:', supabaseUrl)
    console.log('Anon Key (primeiros 20 chars):', anonKey?.substring(0, 20) + '...')
    
    if (!supabaseUrl || !anonKey) {
        console.error('❌ Variáveis de ambiente não encontradas!')
        console.log('Verifique se o arquivo .env.local contém:')
        console.log('NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co')
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon')
        return
    }

    const supabase = createClient(supabaseUrl, anonKey)
    
    try {
        console.log('\n🔐 Testando autenticação...')
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Usuário autenticado:', user ? `${user.email} (${user.id})` : 'Nenhum')
        
        console.log('\n📁 Testando acesso a storage...')
        
        // Teste 1: Listar buckets
        console.log('1️⃣ Tentando listar buckets...')
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()
        
        if (listError) {
            console.error('❌ Erro ao listar buckets:', listError)
            console.log('💡 Possíveis causas:')
            console.log('   - RLS habilitado sem políticas adequadas')
            console.log('   - Chave API incorreta')
            console.log('   - Projeto pausado/suspenso')
            return
        }
        
        console.log('✅ Buckets encontrados:', buckets.map(b => b.name))
        
        // Teste 2: Verificar se bucket curriculos existe
        const curriculosBucket = buckets.find(b => b.name === 'curriculos')
        if (curriculosBucket) {
            console.log('✅ Bucket "curriculos" já existe:', curriculosBucket)
        } else {
            console.log('⚠️  Bucket "curriculos" não existe')
        }
        
        // Teste 3: Tentar criar bucket de teste
        console.log('\n2️⃣ Testando criação de bucket...')
        const testBucketName = `test-${Date.now()}`
        
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(testBucketName, {
            public: true,
            fileSizeLimit: 1048576 // 1MB para teste
        })
        
        if (createError) {
            console.error('❌ Erro ao criar bucket de teste:', createError)
            
            if (createError.message.includes('permission')) {
                console.log('\n🔧 SOLUÇÃO - Problema de Permissão:')
                console.log('1. Verificar se RLS está configurado corretamente')
                console.log('2. Usar service_role key temporariamente')
                console.log('3. Configurar políticas adequadas')
            }
            
            if (createError.message.includes('already exists')) {
                console.log('⚠️  Bucket com nome similar já existe')
            }
            
        } else {
            console.log('✅ Bucket de teste criado com sucesso!')
            
            // Limpar bucket de teste
            const { error: deleteError } = await supabase.storage.deleteBucket(testBucketName)
            if (!deleteError) {
                console.log('🗑️  Bucket de teste removido')
            }
        }
        
        console.log('\n📊 RESUMO:')
        console.log('- Conexão:', listError ? '❌' : '✅')
        console.log('- Listar buckets:', listError ? '❌' : '✅')
        console.log('- Criar buckets:', createError ? '❌' : '✅')
        console.log('- Bucket curriculos:', curriculosBucket ? '✅' : '⚠️')
        
    } catch (error) {
        console.error('❌ Erro geral:', error)
    }
}

// Função para testar com service_role (para admin)
async function testWithServiceRole() {
    console.log('\n🔑 TESTE COM SERVICE_ROLE KEY')
    console.log('=============================')
    
    const serviceRoleKey = prompt('Cole sua service_role key aqui (será apagada após o teste):')
    
    if (!serviceRoleKey) {
        console.log('❌ Service role key não fornecida')
        return
    }
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    
    try {
        // Teste com permissões de admin
        const { data, error } = await supabaseAdmin.storage.createBucket('curriculos', {
            public: true,
            allowedMimeTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ],
            fileSizeLimit: 10485760
        })
        
        if (error && !error.message.includes('already exists')) {
            console.error('❌ Erro mesmo com service_role:', error)
        } else {
            console.log('✅ Bucket "curriculos" criado/existe com service_role!')
        }
        
    } catch (error) {
        console.error('❌ Erro com service_role:', error)
    }
}

// Executar diagnóstico
diagnosticPermissions()

// Exportar função para teste manual
window.testWithServiceRole = testWithServiceRole