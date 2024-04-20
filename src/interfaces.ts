interface WordT {
    wordName: string,
    partOfSpeech: string,
    definition: string,
    customDefinition?: string,
    example?: string,
    vaultIDs?: string[]
}



export default WordT;