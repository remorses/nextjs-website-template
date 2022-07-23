import { Fragment, useContext, useEffect, useState } from 'react'

import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import useSWR, { useSWRConfig } from 'swr'

import { useBeskar, useDisclosure, useThrowingFn } from 'beskar/src/utils'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { PlusIcon } from '@heroicons/react/outline'
import { Select } from 'beskar/src/Select'

import { Input, Button, Divider, Modal, Spinner } from 'beskar/src/landing'
import { getUserSites } from '@app/pages/api/functions'

export function SelectSite({ className = '' }) {
    const { data, error, isValidating } = useSWR('getSites', getUserSites)
    // console.log({ data })
    const sites = data?.sites || []

    if (error) {
        console.error(error)
    }

    const router = useRouter()
    const siteId = (router.query.siteId || '') as string

    const { fn: onChange, isLoading: isOrgLoading } = useThrowingFn({
        fn: async function onChange(value) {
            const site = sites?.find((site) => String(site.id) === value)
            if (!site) {
                console.warn('no site found', value)
                return
            }
            const newPath = `/board/site/${site.id}`
            await router.replace(newPath)
        },
    })

    const { mutate } = useSWRConfig()

    const { fn: onClick, isLoading } = useThrowingFn({
        fn: async function onSubmit({}) {
            await router.push('/new')
        },
        successMessage: '',
        errorMessage: '',
    })

    return (
        <>
            <Select
                useAutoGradientIcons
                isLoading={isValidating || isLoading || isOrgLoading}
                value={siteId}
                onChange={onChange}
                className={classNames('min-w-[16ch]', className)}
                endButton={
                    <Select.SelectButton children='New Site' onClick={onClick} />
                }
                options={sites.map((o) => {
                    return {
                        value: String(o.id),
                        name: o.name,
                    }
                })}
            />
        </>
    )
}
