import asyncio
import os
import edge_tts

VOICE = "fil-PH-BlessicaNeural"
OUTPUT_DIR = os.path.join("public", "audio", "steps")
os.makedirs(OUTPUT_DIR, exist_ok=True)

RECIPES = [
    {
        "id": "sardines-egg-pechay",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. Igisa ang bawang sa mantika hanggang sa maging mabango at bahagyang ginintuan. Humigit-kumulang dalawang minuto sa katamtamang init.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Idagdag ang sardinas at sariwang pechay. Haluin nang marahan hanggang sa lumambot ang pechay, mga apat na minuto sa katamtamang init.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Ilagay ang binating itlog at haluin hanggang sa maluto nang pantay. Humigit-kumulang tatlong minuto sa mahinang init.",
            },
        ],
    },
    {
        "id": "ginisang-pechay-egg",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. Igisa ang sibuyas at kamatis hanggang sa maging malambot at mabango. Humigit-kumulang apat na minuto sa katamtamang init.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Idagdag ang pechay at lutuin hanggang sa malanta ngunit malutong pa rin. Mga tatlong minuto sa katamtamang init.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Ihalo ang binating itlog at timplahan ayon sa iyong panlasa. Humigit-kumulang tatlong minuto sa mahinang init.",
            },
        ],
    },
    {
        "id": "sardine-omelet-tomato",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. Batihin ang mga itlog at ihalo ang sardinas, hiniwang kamatis, at kaunting paminta.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Painitin ang mantika sa kawali at maingat na ibuhos ang pinaghalong itlog at sardinas. Humigit-kumulang dalawang minuto sa katamtamang init.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Lutuin ang magkabilang panig hanggang sa maging ginto at buo ang torta. Mga anim na minuto sa mahinang init.",
            },
        ],
    },
    {
        "id": "chicken-adobo",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. I-marinate ang manok sa toyo, bawang, at paminta sa loob ng labinlimang minuto.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Igisa ang bawang at iprito nang bahagya ang manok hanggang maging bahagyang kulay kape.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Ibuhos ang marinade at suka. Pakuluan nang hindi hinahalo sa loob ng limang minuto.",
            },
            {
                "order": 4,
                "text": "Hakbang apat. Pahupain ang init at lutuin hanggang sa lumambot ang manok at lumapot ang sarsa. Humigit-kumulang labinlimang minuto.",
            },
        ],
    },
    {
        "id": "sinigang-baboy",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. Pakuluan ang baboy kasama ang sibuyas at kamatis hanggang sa maging malambot ang karne.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Idagdag ang pampaasim na sampalok at timplahan ng patis ayon sa panlasa.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Idagdag ang mga gulay tulad ng labanos at sitaw. Lutuin nang tatlong minuto.",
            },
            {
                "order": 4,
                "text": "Hakbang apat. Huling ilagay ang kangkong, patayin ang apoy, at takpan sa loob ng dalawang minuto bago ihain.",
            },
        ],
    },
    {
        "id": "tortang-talong",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. Ihawin ang talong hanggang sa mangitim ang balat, palamigin, at maingat na balatan.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Pitpitin ang talong gamit ang tinidor upang lumapad.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Isawsaw ang talong sa binating itlog na may kaunting asin at paminta.",
            },
            {
                "order": 4,
                "text": "Hakbang apat. Iprito sa mainit na mantika hanggang sa maging ginintuan ang magkabilang panig.",
            },
        ],
    },
    {
        "id": "ginisang-munggo",
        "steps": [
            {
                "order": 1,
                "text": "Hakbang isa. Pakuluan ang munggo sa tubig hanggang sa pumutok at lumambot.",
            },
            {
                "order": 2,
                "text": "Hakbang dalawa. Sa hiwalay na kawali, igisa ang bawang, sibuyas, at kamatis kasama ang tinapa o baboy.",
            },
            {
                "order": 3,
                "text": "Hakbang tatlo. Ihalo ang ginisang sangkap sa pinalambot na munggo at pakuluan nang limang minuto.",
            },
            {
                "order": 4,
                "text": "Hakbang apat. Idagdag ang dahon ng malunggay o ampalaya, timplahan, at patayin ang apoy.",
            },
        ],
    },
]

async def generate_all():
    print(f"Generating audio using voice: {VOICE}...")
    for recipe in RECIPES:
        recipe_id = recipe["id"]
        for step in recipe["steps"]:
            order = step["order"]
            text = step["text"]
            filename = f"{recipe_id}-step-{order}.mp3"
            filepath = os.path.join(OUTPUT_DIR, filename)
            print(f"Synthesizing: {filename}...")
            communicate = edge_tts.Communicate(text, VOICE, rate="-4%")
            await communicate.save(filepath)
            print(f"Saved: {filepath}")

    print("All recipe step audio generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())
