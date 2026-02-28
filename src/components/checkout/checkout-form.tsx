"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail } from "lucide-react"
import { Textarea } from "../ui/textarea"


const detailsSchema = z.object({
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pin: z.string().min(4, "PIN code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .min(8, "Phone seems too short")
    .max(16, "Phone seems too long")
    .refine((value) => value.startsWith("+977"), {
      message: "Phone number must start with +977",
    }),
  save: z.boolean().default(true),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
})

export type CheckoutDetails = z.infer<typeof detailsSchema>

export function CheckoutForm({ onSubmit }: { onSubmit: (values: CheckoutDetails) => void }) {


  // Relax generics to avoid resolver type incompatibilities while keeping runtime validation intact
  const form = useForm<any>({
    resolver: zodResolver(detailsSchema) as any,
    mode: "onTouched",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      pin: "",
      country: "Nepal",
      phone: "",
      save: true,
      shippingMethod: "standard",
    },
  })

  return (
    <form className="space-y-6" aria-labelledby="checkout-form-title" onSubmit={form.handleSubmit((v: CheckoutDetails) => onSubmit(v))}>
      <h2 id="checkout-form-title" className="text-lg font-semibold text-slate-900">
        Contact & Delivery
      </h2>

      <Card className="border-teal-100 bg-transparent p-4 shadow-sm backdrop-blur-sm">
        <Form {...form}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      Email (optional)
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-600" />
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        placeholder="+977 9705467105"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="save"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-xs text-slate-600">Save this information for next time</FormLabel>
                    </FormItem>
                  )}
                />
                 
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="House no, street, area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment / Landmark (optional)</FormLabel>
                    <FormControl>
                      <Textarea  placeholder="Apartment, suite, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                    <Input type="text" placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN code</FormLabel>
                    <FormControl>
                      <Input type="text" inputMode="numeric" placeholder="Postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Country" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             
            </div>
          </div>
        </Form>
      </Card>

      

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-600">By continuing, you agree to our Terms and Privacy Policy.</p>
        <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
          Continue to review
        </Button>
      </div>
    </form>
  )
}
