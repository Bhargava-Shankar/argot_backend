import { Router, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

const router = Router();

function strip(html: string | undefined) {
    if (undefined) return "";
    if (typeof html == "object") html = html[0];
    return html?.replace(/<\s*(?:[^>\n]+)*(?:\s+[^>\n]+)*\s*\n*\/?>/gi, '');

}

router.get("/defintion/:word", async(req: Request, res: Response) => {
    const word: string = req.params['word'];
    const url: string = "https://en.wiktionary.org/api/rest_v1/page/definition";
    await axios.get(`${url}/${word}?redirect=false`).then(
        (response) => {
            const data: object[] = response.data['en'];
            const dat: number[] = [10, 20, 30];
            const output: object[] = [];
            data.map((value: any) => {
                const definitions = value['definitions'];
                definitions.map((definition: any) => {
                    if (definition["definition"] != "") {
                        output.push({
                            "partOfSpeech": value['partOfSpeech'],
                            "definition": strip(definition['definition']),
                            "example": strip(definition['examples']),
                        });
                        // if (definition['examples']) {
                        //     console.log(definition['example'])
                        //     console.log(definition['examples'][0]);
                        // }
                        console.log(definition['examples']);
                        //console.log(definition);
                    }
                })
                //console.log(data);
                return;
            })
            res.send(output.slice(0,5));

        }
    );
})

export default router;