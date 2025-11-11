import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import type { FormEvent } from "react";
import { Link } from "react-router";

export default function Signup() {

  const onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    console.log(e.target)
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg">
        <form onSubmit={onSubmitForm} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">
              Completa el formulario para crear una cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input id="password" type="password" placeholder="••••••" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirmar contraseña</Label>
                </div>
                <Input id="confirm_password" type="password" placeholder="••••••" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Crear cuenta
            </Button>
          </CardFooter>
          <div className="border-t border-neutral-300 mx-6">
            <p className="text-sm text-muted-foreground text-center pt-6 select-none">¿Ya tienes una cuenta?</p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="link" className="w-full">Click aquí para ingresar!</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}