'use client'

import React, { useId } from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

export function Input({
    label,
    error,
    hint,
    className = '',
    id,
    ...props
}: InputProps) {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`${styles.input} ${error ? styles.error : ''} ${className}`}
                {...props}
            />
            {hint && !error && (
                <span className={styles.hint}>{hint}</span>
            )}
            {error && (
                <span className={styles.errorText}>{error}</span>
            )}
        </div>
    )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    hint?: string
}

export function Textarea({
    label,
    error,
    hint,
    className = '',
    id,
    ...props
}: TextareaProps) {
    const generatedId = useId()
    const textareaId = id || generatedId

    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={textareaId} className={styles.label}>
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''} ${className}`}
                {...props}
            />
            {hint && !error && (
                <span className={styles.hint}>{hint}</span>
            )}
            {error && (
                <span className={styles.errorText}>{error}</span>
            )}
        </div>
    )
}

export default Input
