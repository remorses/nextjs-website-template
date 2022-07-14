import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'


export class KnownError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'KnownError'
    }
}
export class AppError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AppError'
    }
}
