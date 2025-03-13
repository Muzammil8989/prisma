"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

type InteractiveInputProps = {
  label: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InteractiveInput({
  label,
  error,
  startIcon,
  endIcon,
  className,
  ...props
}: InteractiveInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();

  return (
    <div className={`relative w-full ${className}`}>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-lg"
          />
        )}
      </AnimatePresence>

      <div className="relative space-y-1">
        <label
          htmlFor={id}
          className={`block pl-1 text-sm transition-colors ${
            error ? "text-red-400" : "text-neutral-300"
          }`}
        >
          {label}
        </label>

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {startIcon}
            </div>
          )}

          <input
            id={id}
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm
              backdrop-blur-lg transition-all duration-300
              placeholder:text-neutral-500 focus:outline-none
              ${startIcon ? "pl-10" : "pl-4"}
              ${endIcon ? "pr-10" : "pr-4"}
              ${error ? "border-red-500/50" : "border-white/10"}
              ${!error && isFocused ? "border-white/30" : ""}
              ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-red-400 text-sm"
          >
            <ExclamationCircleIcon className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}