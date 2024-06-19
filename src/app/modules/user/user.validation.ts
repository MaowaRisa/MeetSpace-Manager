import { z } from "zod";

const createUserValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email({message: 'Email must be valid!'}),
        password: z.string().max(20),
        phone: z.string(),
        role: z.enum(['user', 'admin']),
        address: z.string()
    })
})
const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email({message: 'Email must be valid!'}).optional(),
        password: z.string().max(20).optional(),
        phone: z.string().optional(),
        role: z.enum(['user', 'admin']).optional(),
        address: z.string().optional()
    })
})
// Login validation 
const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: 'Email is required!'
        }).email({message: 'Email must be valid!'}),
        password: z.string({
            required_error: 'Password is required!'
        })
    })
})

export {
    createUserValidationSchema,
    updateUserValidationSchema,
    loginValidationSchema
} 