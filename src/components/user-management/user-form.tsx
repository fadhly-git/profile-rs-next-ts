// components/user-management/user-form.tsx
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserTableData } from "@/types/user"
import { createUser, updateUser } from "@/lib/actions/user-actions"
import { toast } from "sonner"

const userFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR", "USER"]),
    gambar: z.any().optional(),
})

interface UserFormProps {
    user?: UserTableData | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function UserForm({ user, open, onOpenChange, onSuccess }: UserFormProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [previewImage, setPreviewImage] = React.useState<string | null>(
        user?.gambar || null
    )

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            role: user?.role || "USER",
        },
    })

    React.useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                password: "",
                role: user.role,
            })
            setPreviewImage(user.gambar)
        } else {
            form.reset({
                name: "",
                email: "",
                password: "",
                role: "USER",
            })
            setPreviewImage(null)
        }
    }, [user, form])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('role', values.role)

            if (values.password) {
                formData.append('password', values.password)
            }

            if (values.gambar instanceof FileList && values.gambar.length > 0) {
                formData.append('gambar', values.gambar[0])
            }

            if (user) {
                await updateUser(user.id, formData)
                toast.success("User updated successfully")
            } else {
                await createUser(formData)
                toast.success("User created successfully")
            }

            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {user ? "Edit User" : "Create New User"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex justify-center">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={previewImage || undefined} />
                                    <AvatarFallback>
                                        {form.watch("name")?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    {...form.register("gambar", { onChange: handleImageChange })}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password {user && "(Leave blank to keep current)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USER">User</SelectItem>
                                            <SelectItem value="MODERATOR">Moderator</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : (user ? "Update" : "Create")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}