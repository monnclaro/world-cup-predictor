import Head from "next/head";
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
    <>
      <Head>
        <title>NLW Copa</title>
        <meta name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto grid h-screen max-w-[1124px] grid-cols-2 items-center gap-28">
        <main>
          <Image src={logoImg} alt="NLW Copa" />
          <h1 className="mt-14 text-5xl font-bold leading-tight text-white">
            Crie seu próprio bolão da copa e compartilhe entre amigos
          </h1>

          <div className="mt-10 flex items-center gap-2">
            <Image src={userAvatarExample} alt="Avatar dos usuários" />
            <strong className="text-xl text-gray-100">
              <span className="text-ignite-500">+{props.userCount}</span>{" "}
              pessoas já estão usando
            </strong>
          </div>

          <form onSubmit={createPool} className="mt-10 flex gap-2">
            <input
              type="text"
              required
              placeholder="Qual o nome do seu bolão?"
              className="text-small flex-1 rounded border border-gray-600 bg-gray-800 px-6 py-4 text-gray-100"
              onChange={(event) => setPoolTitle(event.target.value)}
              value={poolTitle}
            />
            <button
              type="submit"
              className="text-small rounded bg-yellow-500 px-6 py-4 font-bold uppercase text-gray-900 hover:bg-yellow-700"
            >
              Criar meu bolão
            </button>
          </form>

          <p className="mt-4 text-sm leading-relaxed text-gray-300">
            Após criar seu bolão, você receberá um código único que poderá ser
            usado para convidar outras pessoas 🚀
          </p>

          <div className="mt-10 flex items-center justify-between border-t border-gray-600 pt-10 text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">+{props.poolCount}</span>
                <span>Bolões criados</span>
              </div>
            </div>

            <div className="h-14 w-px bg-gray-600" />

            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">+{props.guessCount}</span>
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
    </>
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
