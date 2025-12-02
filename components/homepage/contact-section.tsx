"use client";

import { bookAppointmentRequest } from "@/actions/appointment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  APPOINTMENT_TIMES,
  bookAppointment,
  DENTAL_SERVICES,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LiaSpinnerSolid } from "react-icons/lia";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { MARITAL_STATUS } from "@/lib/const";

export type appointmentValues = z.infer<typeof bookAppointment>;
export function ContactSection() {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<appointmentValues>({
    resolver: zodResolver(bookAppointment),
    defaultValues: {
      date: "",
      email: "",
      firstName: "",
      timeSlot: "02:00pm - 03:00pm  1h",
      lastName: "",
      phone: "",
      reason: "",
      services: "Aesthentic Medicine",
      marital_status: "DIVORCED",
    },
    mode: "all",
  });

  const handleSubmit = async (data: appointmentValues) => {
    setLoading(true);
    const payload: appointmentValues = {
      marital_status: data.marital_status,
      date: data.date,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      reason: data.reason,
      services: data.services,
      timeSlot: data.timeSlot,
    };
    try {
      const res = await bookAppointmentRequest(payload);
      console.log({ res });
      if (!res) {
        setLoading(false);
        form.reset();
        toast.error("Something went wrong", {
          description: "There was a problem booking your appointment",
        });
      } else {
        form.reset();
        setLoading(false);
        toast.success("Appointment booked successfuly", {
          description: "Check your email for more information",
        });
      }
    } catch (e: unknown) {
      setLoading(false);
      console.log("Something went wrong", e);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Schedule Your Consultation
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your smile? Contact us today to book your
            appointment with our celebrity dentist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                Book Your Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4">
                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      name="firstName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              {...field}
                              placeholder="Enter your first name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="lastName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={loading}
                              placeholder="Enter your last name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={loading}
                              placeholder="Enter your email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              {...field}
                              placeholder="Enter your phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="services"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={loading}>
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DENTAL_SERVICES.map((item, k) => (
                                <SelectItem key={k} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="marital_status"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={loading}>
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MARITAL_STATUS.map((item, k) => (
                                <SelectItem key={k} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              disabled={loading}
                              {...field}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="timeSlot"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slots</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={loading}>
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {APPOINTMENT_TIMES.map((item, k) => (
                                <SelectItem key={k} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="reason"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={loading}
                            placeholder="Enter your message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="">
                    <Button
                      disabled={loading}
                      className=" cursor-pointer w-full"
                      type="submit">
                      {loading ? (
                        <div className=" items-center gap-3 flex">
                          <LiaSpinnerSolid className=" animate-spin" />
                          <p>Booking</p>
                        </div>
                      ) : (
                        <p>Book Appointment</p>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Visit Our Clinic
                    </h3>
                    <Link
                      target="__blank"
                      href={"https://maps.app.goo.gl/2t42wni9qnKirtQJ6"}
                      className="text-sm text-muted-foreground hover:text-primary">
                      6th Floor, Polystar Building, Marwa Bus-stop
                      <br />
                      128 Remi Olowode Street, Lekki Phase 1
                      <br />
                      Lagos, Nigeria.
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Call Us
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <a
                        href="tel:+2348171615134"
                        className="hover:text-primary transition-colors">
                        (+234) 817 161 5134
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Emergency line available 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email Us
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <a
                        href="mailto:info@whitenlighten.com"
                        className="hover:text-primary transition-colors">
                        info@whitenlighten.com
                      </a>
                      <br />
                      <a
                        href="mailto:whitenlightenlounge@gmail.com"
                        className="hover:text-primary transition-colors">
                        whitenlightenlounge@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Office Hours
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Monday to Saturday (9:00 am - 5:00 pm)</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
