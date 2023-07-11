import cors from 'cors'
import { NextResponse } from "next/server" 
import { corsHeaders } from '@/utils/cors_config';

export const runtime = 'edge'

const API_KEY = process.env.OPENAI_API_KEY
const URL = process.env.URL_OPENAI_COMPLETIONS
const REGEX = /^[\d.]+\.\s/;

export async function OPTIONS(req, res, next) {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req, res, next) {
    const content = await req.json()

    const data_user = content.user || ''
    const data_assistant = content.assistant || ''

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: "Genera una lista de recomendaciones cortas de consultas que se pueden hacer a un asistente de odoo, esta debe de ser una lista de 3 recomendaciones, las recomendaciones solo deben de ser consultas de datos, tomando en cuenta el siguiente contexto:{'user':'" + data_user + "','assistant':'" + data_assistant + "'}\nResp:",
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop:["END"],
        })
    } 

    const response = await fetch(URL, params)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()
    const recommendations = format_recommendations(data.choices[0].text)

    console.log(recommendations)

    return NextResponse.json(recommendations, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}

const format_recommendations = (text) => {
    const text_arr = text.trim().split("\n");
    const cleaned_text = text_arr.map(txt => txt.replace(REGEX, ''));
    return cleaned_text
}