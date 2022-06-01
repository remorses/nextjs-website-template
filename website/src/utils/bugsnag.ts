// import Bugsnag from '@bugsnag/js'
// import BugsnagPluginReact from '@bugsnag/plugin-react'
import { WrapMethod } from 'next-rpc'
import React from 'react'
import { AppError, KnownError } from '.'

// Bugsnag.start({
//     apiKey: '18ece2828f1d70ee8ae6038e59bf9541',
//     plugins: [new BugsnagPluginReact(React as any) as any],
//     enabledReleaseStages: ['production'],
//     releaseStage: process.env.VERCEL_ENV || process.env.NODE_ENV,
// })

export function notifyError(error, msg?: string) {
    console.log(msg, error)
    if (msg && error?.message) {
        error.message = msg + ': ' + error?.message
    }
    // return new Promise((resolve) => Bugsnag.notify(error, resolve, resolve))
}

export const wrapMethod: WrapMethod = (method, meta) => {
    return async (...args) => {
        try {
            const result = await method(...args)

            return result
        } catch (e) {
            if (e instanceof KnownError) {
                throw e
            }
            await notifyError(e, `rpc ${meta.name} in ${meta.pathname}`)
            if (e instanceof AppError) {
                throw e
            }
            // throw a generic error like "Something went wrong" so that user does not see the precise error
            throw new Error('Something went wrong')
        }
    }
}

export function wrapApiHandler(fn) {
    return async function wrappedFunction(req, res) {
        try {
            return await fn(req, res)
        } catch (e) {
            if (e instanceof KnownError) {
                throw e
            }

            const url = new URL(req.url)
            await notifyError(e, `api ${url.pathname}`)
            throw e
        }
    }
}

// export const ErrorBoundary: any = Bugsnag.getPlugin(
//     'react',
// ).createErrorBoundary(React as any)
