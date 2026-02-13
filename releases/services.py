from groq import Groq
from django.conf import settings

def generate_user_notes(changelog_text: str) -> str:
    client = Groq(api_key=settings.GROQ_API_KEY)

    prompt = f"""
                Você é um assistente que escreve notas de atualização para usuários finais.

                Reescreva o changelog técnico abaixo.

                REGRAS OBRIGATÓRIAS:
                - linguagem simples
                - português do Brasil
                - máximo 6 bullets
                - cada bullet com no máximo 1 frase
                - NÃO mencionar commits, versões ou código
                - foco apenas no que mudou para o usuário

                Responda APENAS a lista.

                Changelog:
                {changelog_text}
            """


    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
    )

    return response.choices[0].message.content
