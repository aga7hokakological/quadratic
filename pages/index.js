import styles from '../styles/Home.module.css'

import { useState } from 'react';
import { ethers } from 'ethers'

import Quadratic from '../src/artifacts/contracts/Quadratic.sol/Quadratic.json'

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {

  let ngoAddress = [];
  let projectAddress = [];
  const [ngo, setNGOvalue] = useState({ name: '', someval: '' })
  const [project, setProjectvalue] = useState({ pId: '', name: '', pStartTime: '', pEndTime: '' }) 
  const [pool, setMatchPoolvalue] = useState({ sTime: '', eTime: '', creator: '', amt: '' })
  
  async function requestAccount() {
    await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
  }

  // setting NGO details
  async function setNGOdetails() {
    if (typeof window.ethereum !== 'undefined') {

      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      let myAddress = await signer.getAddress();
      ngoAddress.push(myAddress);
      // console.log(ngoAddress);

      const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, signer);

      const { name, someval } = ngo
          if(!name || !someval) return 
          const ngodata = JSON.stringify({
              name,
              someval
          })

      console.log(ngodata)

      const data = await quadraticContract.setNgo(myAddress, name, someval)

      const ngos = await Promise.all(data.map(async i => {
        let n = {
          name: i.name,
          someval: i.someval,
        }
        return n
      }))
      setNGOvalue(ngos)
    }
  }

  // Getting NGO details
  async function getNGOdetails() {
    const provider = new ethers.providers.JsonRpcProvider();

    const signer = provider.getSigner();
    const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, signer);

    try {
      const data = await quadraticContract.getAllNGOs();
      console.log("data: ", data.toString())
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  // Setting Project details
  async function setProjectdetails() {
    if (typeof window.ethereum !== 'undefined') {
      let pIdCounter = 0;
      requestAccount()
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let myAddress = await signer.getAddress();
      const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, signer);

      const { name } = project
          if(!pIdCounter || !name || !pStartTime || !pEndTime) return 
          const projectdata = JSON.stringify({
            pIdCounter,  
            name,
            pStartTime,
            pEndTime
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


  // Setting MatchPool details
  async function setMathPooldetails() {
    if (typeof window.ethereum !== 'undefined') {
      let mIdCounter = 0;
      requestAccount()
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let myAddress = await signer.getAddress();
      const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, signer);

      const { mIdCounter, sTime, eTime, creator, amt } = project
          if(!mIdCounter || !sTime || !eTime || !creator || !amt) return 
          const projectdata = JSON.stringify({
            mIdCounter,  
            sTime,
            eTime,
            creator,
            amt
          })

      const data = await quadraticContract.setMatchPool(
        mIdCounter, 
        sTime, 
        eTime, 
        myAddress, 
        ethers.utils.parseEther(amt)
      )

      const pools = await Promise.all(data.map(async i => {
        let m = {
          pId: mIdCounter,
          name: i.name,
          pStartTime: i.pStartTime,
          pEndTime: i.pEndTime,
          amt: amt
        }
        return m
      }))
      setProjectvalue(pools)
      mIdCounter++;
    }
  }

  // Getting MatchPool details
  // async function getMatchPooldetails() {
  //   const provider = new ethers.providers.JsonRpcProvider();
  //   const quadraticContract = new ethers.Contract(contractAddress, Quadratic.abi, provider);

  //   try {
  //     const data = await quadraticContract.getProject()
  //     console.log("data: ", data)
  //   } catch (err) {
  //     console.log("Error: ", err)
  //   }
  // }


  return (
    <div className={styles.container}>
      <input onChange={e => setNGOvalue(e.target.value)} placeholder='NGO1'></input>
      <input onChange={e => setNGOvalue(e.target.value)} placeholder='mydetails'></input>
      <button onClick={setNGOdetails}>Register NGO</button>

      <button onClick={getNGOdetails}>Get NGO</button>
      <br/>
      <br/>
      <br/>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Project1'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Project start time'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Project end time'></input>

      <button onClick={setProjectdetails}>Register Project</button>

      <button onClick={getProjectdetails}>Get Projects</button>
      <br/>
      <br/>
      <br/>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='startTime'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='endTime'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Creator Address'></input>
      <input onChange={e => setProjectvalue(e.target.value)} placeholder='Pool Amount'></input>

      <button onClick={setMatchPoolvalue}>Register matchPool</button>

      <button onClick={getMatchPooldetails}>Get matchPool</button>
    </div>
  )
}
