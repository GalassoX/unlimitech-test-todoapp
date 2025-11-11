type ComponentProps = { status: boolean };

export default function TaskStatusBadge({ status }: ComponentProps) {
  if (!status) {
    return <div className="bg-red-100 text-red-600 font-semibold py-0.5 px-2 rounded-lg text-xs">Sin empezar</div>
  }
  return <div className="bg-green-100 text-green-600 font-semibold py-0.5 px-2 rounded-lg text-xs">Listo</div>
}