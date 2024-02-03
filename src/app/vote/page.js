"use client"

import { useState, useEffect } from "react";
import Head from "next/head";
import { getCurrentVoting, addVote } from "@/services/Web3Service";
import { useRouter } from "next/navigation";

export default function Vote() {

    const { push } = useRouter();

    const DEFAULT_OPTION = { name: "Loading...", image: "https://cdn.pixabay.com/photo/2015/11/03/08/56/question-mark-1019820_960_720.jpg" };

    const [message, setMessage] = useState("");
    const [voting, setVoting] = useState({ maxDate: Date.now() });
    const [option1, setOption1] = useState(DEFAULT_OPTION);
    const [option2, setOption2] = useState(DEFAULT_OPTION);
    const [showVotes, setShowVotes] = useState(0);

    useEffect(() => {
        if (!localStorage.getItem("wallet")) return push("/");

        getCurrentVoting()
            .then(voting => {
                console.log(voting);
                setVoting(voting);
                setOption1(getOption(voting.option1));
                setOption2(getOption(voting.option2));
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }, [])

    function getOption(option) {
        switch (option) {
            case "Nintendo": return { name: "Nintendo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-QmAZ-wLl-Yo8dOULagkxgp2l-UmSMEmpGwb_uSsu9Pj9L7AycsVjVHeWZtiy8PYltc8&usqp=CAU" };
            case "Sega": return { name: "Sega", image: "https://pbs.twimg.com/profile_images/1637837453284311040/ZGd7YN2j_400x400.jpg" };
            default: return DEFAULT_OPTION;
        }
    }

    function btnVote2Click() {
        setMessage("Conectando na carteira...aguarde...");
        addVote(2)
            .then(() => {
                setShowVotes(2);
                setMessage("Resultados parciais sujeitos a alteração minuto a minuto.");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }

    function btnVote1Click() {
        setMessage("Conectando na carteira...aguarde...");
        addVote(1)
            .then(() => {
                setShowVotes(1);
                setMessage("Resultados parciais sujeitos a alteração minuto a minuto.");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }

    return (
        <>
            <Head>
                <title>GameVoteWeb3 | Votação</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="container col-xxl-8 px-4 py-5">
                <div className="row align-items-center">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">GameVoteWeb3</h1>
                    <p className="lead">Votação on-chain de duas rivais na história dos videogames! E aí, qual prefere? Vote em uma.</p>
                    {
                        voting.maxDate > (Date.now() / 1000)
                            ? <p className="lead mb-3">Você tem até {new Date(Number(voting.maxDate) * 1000).toString()} para deixar seu voto em um dos videogames abaixo.</p>
                            : <p className="lead mb-3">Votação encerrada. Confira abaixo os resultados.</p>
                    }
                </div>
                <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                            {voting.option2}
                        </h3>
                        <img src={option2.image} className="d-block mx-auto img-fluid rounded" width={250} height={250} />
                        {
                            showVotes > 0 || voting.maxDate < (Date.now() / 1000)
                                ? <button className="btn btn-secondary p-3 my-2 d-block mx-auto" style={{ width: 250 }} disabled={true}>{showVotes === 2 ? Number(voting.votes2) + 1 : Number(voting.votes2)} votos</button>
                                : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }} onClick={btnVote2Click}>Quero votar nesse!</button>
                        }
                    </div>
                    <div className="col-5">
                        <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                            {voting.option1}
                        </h3>
                        <img src={option1.image} className="d-block mx-auto img-fluid rounded" width={250} height={250} />
                        {
                            showVotes > 0 || voting.maxDate < (Date.now() / 1000)
                                ? <button className="btn btn-secondary p-3 my-2 d-block mx-auto" style={{ width: 250 }} disabled={true}>{showVotes === 1 ? Number(voting.votes1) + 1 : Number(voting.votes1)} votos</button>
                                : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }} onClick={btnVote1Click}>Quero votar nesse!</button>
                        }
                    </div>
                </div>
                <div className="row align-items-center">
                    <p className='message'>{message}</p>
                </div>
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <p className="col-md-4 mb-0 text-body-secondary">&copy; 2024 GameVoteWeb3, Inc</p>
                    <ul className="nav col-md-4 justify-content-end">
                        <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li>
                        <li className="nav-item"><a href="/about" className="nav-link px-2 text-body-secondary">About</a></li>
                    </ul>
                </footer>
            </div>
        </>
    );
}
