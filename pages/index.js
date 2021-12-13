import styles from '../styles/Home.module.css'

import { useState } from 'react';
import { ethers } from 'ethers'

import Quadratic from '../src/artifacts/contracts/Quadratic.sol/Quadratic.json'

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {

  let ngoAddress = [];
  const [ngo, setNGOvalue] = useState({ name: '', someval: '' })
  const [project, setProjectvalue] = useState({ pId: '', name: '', pStartTime: '', pEndTime: '' }) 

  // setting NGO details
  async function setNGOdetails() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    let myAddress = await signer.getAddress()

    ngoAddress.push(myAddress);
    // console.log("Account:", myAddress);
    // const provider = new ethers.providers.JsonRpcProvider();
    const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, signer);

    const { name, someval } = ngo
        if(!name || !someval) return 
        const ngodata = JSON.stringify({
            name
        })

    console.log(ngodata)

    const data = await quadraticContract.setNgo(name, someval)

    const ngos = await Promise.all(data.map(async i => {
      let n = {
        name: i.name,
        someval: i.someval,
      }
      return n
    }))
    setNGOvalue(ngos)
  }

  // Getting NGO details
  async function getNGOdetails() {
    const provider = new ethers.providers.JsonRpcProvider();
    const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, provider);

    try {
      const data = await quadraticContract.getNGO(ngoAddress[0]);
      console.log("data: ", data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  // Setting Project details
  async function setProjectdetails() {
    let pIdCounter = 0;
    let provider = requestAccount()
    // const provider = new ethers.providers.JsonRpcProvider();
    const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, provider);

    const { name } = project
        if(!pIdCounter || !name || !pStartTime || !pEndTime) return 
        const projectdata = JSON.stringify({
            name
        })

    console.log(projectdata)

    const data = await quadraticContract.setProject()

    const projects = await Promise.all(data.map(async i => {
      let p = {
        pId: pIdCounter,
        name: i.name,
        pStartTime: i.pStartTime,
        pEndTime: i.pEndTime,
      }
      return p
    }))
    setProjectvalue(projects)
    pIdCounter++;
  }

  // Getting Project details
  async function getProjectdetails() {
    const provider = new ethers.providers.JsonRpcProvider();
    const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, provider);

    try {
      const data = await quadraticContract.getProject()
      console.log("data: ", data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  return (
    <div className={styles.container}>
      <input onChange={e => setNGOvalue(e.target.value)} placeholder='NGO1'></input>
      <input onChange={e => setNGOvalue(e.target.value)} placeholder='mydetails'></input>
      <button onClick={setNGOdetails}>Register NGO</button>

      <button onClick={getNGOdetails}>Get NGO</button>

      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Project1'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Project start time'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Project end time'></input>

      <button onClick={setProjectdetails}>Register Project</button>

      <button onClick={getProjectdetails}>Get Projects</button>
    </div>
  )
}
