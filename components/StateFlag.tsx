import { nomeEstado } from "@/lib/brasil";

export default function StateFlag({
  uf,
  className,
}: {
  uf: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- bandeiras são SVGs estáticos servidos diretamente, sem necessidade de otimização do next/image
    <img
      src={`/flags/${uf}.svg`}
      alt={`Bandeira de ${nomeEstado(uf)}`}
      title={nomeEstado(uf)}
      className={`inline-block rounded-sm object-cover shadow-sm ring-1 ring-black/10 ${className ?? "h-4 w-6"}`}
    />
  );
}
