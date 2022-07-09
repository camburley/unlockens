import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState } from 'react'
import { Input, Button } from 'degen'
import 'degen/styles'



export default function Home() {
  const [inputValue, setInputValue ] = useState();
  const [ fieldValue, setFieldValue ] = useState();
  const [converted, setConverted] = useState();
  const [invalidAddress, setInvalidAddress ] = useState();
  const [loading, setLoading] = useState();


  const handleSubmission = async (value) => {
      setLoading(true);
      if(value.length === 42 ){
        const ENDPOINT = `http://localhost:5002/v1/address?convert=${value}`
        try {
          const res = await fetch(ENDPOINT, {
            method: 'GET'
          });
          if(res.ok){
            const obj = await res.json();
            console.log("obj", obj);
             const original = obj.original 
             const converted = obj.resolved

             setConverted(converted);
             setLoading(false);
          }
        } catch (error) {
          console.log("somethings up bro...: ", error);
          setLoading(false);
        }
      } else {
        const ENDPOINT = `http://localhost:5002/v1/ens?convert=${value}`
        try {
          const res = await fetch(ENDPOINT, {
            method: 'GET'
          });
          if(res.ok){
            const obj = await res.json();
            console.log("obj", obj);
             const original = obj.original 
             const converted = obj.converted

             setConverted(converted);
             setLoading(false);
          }
        } catch (error) {
          setInvalidAddress(true);
          console.log("something weird happened: ", error);

        }
      }
  }

  const handleClickInput = () => {
    console.log("user clicked in the field tho....")
  }

  const handleKeyDown = e => {
    if(e.keyCode === 13 ){ // 13 = enter button
      return handleSubmission(inputValue);
      
    }

    if(e.keyCode === 8){ // 8 = delete / backspace
      e.preventDefault();
      const edited = inputValue.slice(0, -1);
      setInputValue(edited);

    }


  }

  const handleAddingFieldvalue = e => {
    e.preventDefault();
    const userText = e.target.value
    console.log("userText", userText);
    setInputValue(userText);
    if( inputValue && inputValue.length > 0 ){
      setFieldValue(true);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>2 Way Converter</title>
        <meta name="description" content="unlock ENS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* add input  */}

          <Input placeholder='Add ENS or Wallet Address...' onClick={handleClickInput} onKeyDown={handleKeyDown} onChange={handleAddingFieldvalue } value={inputValue} style={ 
            inputValue && inputValue.startsWith("0x") && inputValue.length > 35 ? {
              fontSize: '12px',
              paddingTop: '0px',
              marginTop: '0px',
              backgroundColor: 'transparent'
            } : {
              borderColor: 'black',
              paddingTop: '0px',
              marginTop: '0px', 
              backgroundColor: 'transparent'
            }
          } />

          { invalidAddress ? 'hmmm seems like the address/ens isnt valid or not connected to an active wallet' : 
          <div style={{ marginTop: '10px'}}>
            <span>{converted && converted !== null ? converted : '' }</span>
          </div>
          }

          {
            !loading ? <Button onClick={() => handleSubmission(inputValue) } loading={loading ? loading : false } >Send</Button> : '...'
          }

      </main>

    </div>
  )
}
