import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { signup } from "@/services/auth";
import { AlertCircleIcon } from "lucide-react";
import { useCallback, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function Signup() {
  const [isLoadingSignup, setIsLoadingSignup] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const checkConfirmPasswordFn = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');

    if (!password) return;

    if (password.toString().length < 8) {
      setPasswordError('La contraseña debe contener minimo 8 caracteres.')
    } else if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.')
    } else {
      setPasswordError(null)
    }
  }, []);
  const navigate = useNavigate();

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement)

    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) return;

    setIsLoadingSignup(true);
    try {
      await signup({ 
        username: username.toString(),
        password: password.toString()
      });
      setIsLoadingSignup(false);
      navigate(ROUTES.TASKS);
    } catch (error: any) {
      setIsLoadingSignup(false);
      setSignupError(error.message);
      setTimeout(() => {
        setSignupError(null);
      }, 4000);
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg">
        <form onSubmit={onSubmitForm} ref={formRef} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">
              Completa el formulario para crear una cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signupError ?
              <Alert className="mb-6 bg-red-100 border-red-400" variant='destructive'>
                <AlertCircleIcon />
                <AlertTitle>{signupError}</AlertTitle>
              </Alert>
            : null}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
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
                  required
                  name="password"
                  className={`${passwordError ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}`}
                  onChange={checkConfirmPasswordFn} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirmar contraseña</Label>
                </div>
                <Input id="confirm_password" 
                  type="password"
                  placeholder="••••••"
                  required
                  name="confirm_password"
                  className={`${passwordError ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}`}
                  onChange={checkConfirmPasswordFn} />
              </div>
              {passwordError && <p className="text-xs text-red-500">• {passwordError}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoadingSignup}>
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