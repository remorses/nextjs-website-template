import { test, assert, expect } from 'vitest'
import 'dotenv/config'
import { openai } from '.'
test(
    'ready',
    async () => {
        const emb = await openai.createEmbedding({
            input: [
                'I really hate gitbook',
                'I love gitbook! just used it for the docs site of maku',
                `The first version of KUNFT Gitbook is out, more to be added in the future! 

                Give it a read🤩
                docs.kunftmarketplace.io
                
                There's only a few hours left to secure a whitelist spot in our IDO, here's the link to take part👇🚀
                app.viralsweep.com/sweeps/full/9d…
                
                #KUNFT #KNFT #CasperPad #Casper`,
            ],
            model: 'text-similarity-babbage-001',
        })
        const labelsInputs = [
            'praising gitbook',
            'something else',
            'complaining about gitbook',
        ]
        const labels = await openai.createEmbedding({
            input: labelsInputs,
            model: 'text-similarity-babbage-001',
        })
        for (let [index, label] of labels.data.data
            .map((x) => x.embedding)
            .entries()) {
            const sims = emb.data.data
                .map((x) => x.embedding)
                .map((x, i) => {
                    return cosinesim(label, x)
                })
            console.log(sims)
            const max = indexOfMax(sims)
            console.log(`${index} -> ${labelsInputs[max]}`)
        }
    },
    1000 * 100,
)

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1
    }

    var max = arr[0]
    var maxIndex = 0

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i
            max = arr[i]
        }
    }

    return maxIndex
}

function cosinesim(A, B): number {
    var dotproduct = 0
    var mA = 0
    var mB = 0
    for (let i = 0; i < A.length; i++) {
        // here you missed the i++
        dotproduct += A[i] * B[i]
        mA += A[i] * A[i]
        mB += B[i] * B[i]
    }
    mA = Math.sqrt(mA)
    mB = Math.sqrt(mB)
    var similarity = dotproduct / (mA * mB) // here you needed extra brackets
    return similarity
}
