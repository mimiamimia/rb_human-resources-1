import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-server";
import { decode } from "base64-arraybuffer";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const body = await req.json();

  const {
    nome,
    email,
    telefone,
    cidade,
    areaInteresse,
    nivelExperiencia,
    experiencia,
    curriculo,
    linkedin,
    aceiteTermos,
    fileName,
    fileType
  } = body;

  console.log("Dados recebidos:", body);

  const { data, error } = await supabaseAdmin.storage
    .from("curriculos")
    .upload(fileName, decode(curriculo), {
      cacheControl: "3600",
      upsert: false,
      contentType: fileType,
    });

  if (error) {
    console.error("Erro ao fazer upload do currículo:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do currículo" },
      { status: 500 }
    );
  }

  return supabaseAdmin
    .from("candidates")
    .insert({
      nome,
      email,
      telefone,
      cidade,
      area_interesse: areaInteresse,
      nivel_experiencia: nivelExperiencia,
      experiencia,
      curriculo_url: data.path,
      linkedin,
      aceite_termos: aceiteTermos,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .then((response) => {
      console.log("Candidato cadastrado com sucesso:", response);
      return NextResponse.json(
        { message: "Candidato cadastrado com sucesso" },
        { status: 200 }
      );
    })
    .catch((error) => {
      console.error("Erro ao cadastrar candidato:", error);
      return NextResponse.json(
        { error: "Erro ao cadastrar candidato" },
        { status: 500 }
      );
    });
};
