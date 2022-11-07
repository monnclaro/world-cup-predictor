import Image from "next/image";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

import logoImg from "../assets/logo.svg";
import iconCheckImg from "../assets/icon-check.svg";
import appPreviewingImg from "../assets/app-nlw-copa-preview.png";
import userAvatarExample from "../assets/users-avatar-example.png";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência"
      );
      setPoolTitle("");
    } catch (err) {
      alert("Falha ao criar o bolão, tente novamente");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExample} alt="Avatar dos usuários" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-small text-gray-100"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="px-6 py-4 rounded bg-yellow-500 text-gray-900 text-small font-bold uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá ser
          usado para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewingImg}
        alt="Dois celulares exibindo a prévia da aplicação"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
