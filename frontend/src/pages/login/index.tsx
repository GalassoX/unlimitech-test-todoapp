import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { login } from "@/services/auth";
import { AlertCircleIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [isValidUser, setIsValidUser] = useState<boolean>(true);
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement)

    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) return;

    setIsLoadingLogin(true);
    const status = await login({ 
      username: username.toString(),
      password: password.toString()
    });

    if (status) {
      navigate(ROUTES.TASKS);
    }

    setIsLoadingLogin(false);

    setIsValidUser(status);
    setTimeout(() => {
      setIsValidUser(true);
    }, 4000);
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg">
        <form onSubmit={onSubmitForm} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Inicio de sesión</CardTitle>
            <CardDescription className="text-center">
              Coloca tus credenciales para ingresar a la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isValidUser ?
              <Alert className="mb-6 bg-red-100 border-red-400" variant='destructive'>
                <AlertCircleIcon />
                <AlertTitle>Usuario o contraseña inválido</AlertTitle>
              </Alert>
            : null}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Correo</Label>
                <Input id="username"
                  type="text"
                  name="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input id="password"
                  type="password"
                  placeholder="••••••"
                  name="password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoadingLogin}>
              Ingresar
            </Button>
          </CardFooter>
          <div className="border-t border-neutral-300 mx-6">
            <p className="text-sm text-muted-foreground text-center pt-6 select-none">¿No tienes una cuenta?</p>
            <Link to={ROUTES.SIGNUP}>
              <Button variant="link" className="w-full">Click aquí para crear una!</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}