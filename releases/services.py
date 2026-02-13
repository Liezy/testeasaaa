from groq import Groq
from django.conf import settings

def generate_user_notes(changelog_text: str) -> str:
    client = Groq(api_key=settings.GROQ_API_KEY)

    prompt = f"""Você é um assistente que escreve notas de atualização para usuários finais.

Reescreva o changelog técnico abaixo em format CONCISO e SEM REDUNDÂNCIAS.

REGRAS OBRIGATÓRIAS:
- linguagem simples e objetiva
- português do Brasil
- máximo 3 bullets (não mais!)
- cada bullet com MAX 1 frase curta
- NÃO mencionar: commits, versões, termos técnicos, código
- NÃO ser redundante (não repetir a mesma ideia)
- APENAS mudanças relevantes para o usuário final
- Se muitas mudanças semelhantes, agrupe em 1 bullet

Responda APENAS os bullets, SEM numeração, SEM "# Changes" ou similar.

Changelog:
{changelog_text}"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content
