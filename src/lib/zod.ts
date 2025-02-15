import { z } from "zod"

//Aqui se ponen las restricciones del email y la contraseña
export const loginformSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

export const registerformSchema = z.object({
  photoURL: z
    .instanceof(File, {
      message: "Por favor suba una imagen valida",
    })
    .refine((data) => data.size < 2 * 1024 * 1024, {
      message: "La imagen debe de pesar menos de 2MB"
    }),
  displayName: z
    .string()
    .min(8, "Se requiere de mínimo 8 caracteres"),
  email: z.string().email(),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Las dos contraseñas deben de ser iguales"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las dos contraseñas deben ser iguales"
});

export const searchFormSchema = z.object({
  email: z.string().email(
    "Por favor introduzca un correo válido"
  )
});