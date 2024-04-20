import axios from "axios";
import WordT from "../interfaces";

function strip(html: string | undefined) {
    if (undefined) return " ";
    if (typeof html == "object") html = html[0];
    return html?.replace(/<\s*(?:[^>\n]+)*(?:\s+[^>\n]+)*\s*\n*\/?>/gi, '');

}

const getWordDefinition = async(word: string): Promise<WordT[]> => {
    const url: string = "https://en.wiktionary.org/api/rest_v1/page/definition";
    const output: WordT[] = [];
    const data = await axios.get(`${url}/${word}?redirect=false`).then(
        (response) => {
            return response.data['en'];
        }
    );
    data.map((value: any) => {
        const definitions = value['definitions'];
        definitions.map((definition: any) => {
            if (definition["definition"] != "") {
                const wordObject: WordT =
                {
                    "wordName": word,
                    "partOfSpeech": value['partOfSpeech'],
                    "definition": strip(definition['definition'])!,
                    "example": strip(definition['examples']),
                }
                output.push(wordObject);
            }
        })
    })
    return output.slice(0,5);
}

export default getWordDefinition;