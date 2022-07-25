import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react'
import { Input, Button } from 'degen'
import 'degen/styles'
import Link from 'next/link'

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import {makeStyles} from "@material-ui/core/styles";
import { Mixpanel } from '../helpers/mixpanel'


export default function Home() {
  const [inputValue, setInputValue ] = useState();
  const [ savedTwitter, setSavedTwitter ] = useState();
  const [ fieldValue, setFieldValue ] = useState();
  const [converted, setConverted] = useState();
  const [invalidAddress, setInvalidAddress ] = useState();
  const [loading, setLoading] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  const [ savedName, setSavedName ] = useState();  
  const [ savedENS, setSavedENS ] = useState();
  const [ savedEmail, setSavedEmail ] = useState();
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);



  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


  const useStyles = makeStyles((theme) => ({
    root: {
      [theme.breakpoints.down("xs")]: {
        alignItems: "flex-end", // push the dialog to bottom,
      }
      },
      notRoot: {
        [theme.breakpoints.down("xs")]: {
          alignItems: "center" ,
          backgroundColor: "#FFFFFF16"
        }
      },
      paper: {
        // make the content full width
        [theme.breakpoints.down("xs")]: {
          margin: 0,
          maxWidth: "100%",
          width: "100%",
          height: "100%",
          backgroundColor: '#1c1c1d',
          
        }
      },
      SlideUpPaper: {
        // make the content full width
        [theme.breakpoints.down("xs")]: {
          margin: 0,
          maxWidth: "100%",
          minWidth: '100%',
          width: "100%",
          height: "100%",
          backgroundColor: '#1c1c1d',
          
        }
      },
      squarePaper: {
        // make the content full width
        [theme.breakpoints.down("xs")]: {
          margin: 0,
          zIndex: 80000,
          backgroundColor: 'black',
          paddingLeft: '5%',
          paddingRight: '5%', 
          paddingBottom: '5%', 
          paddingTop: '5%', 
          borderRadius: '6px'
          
        }
      },
      appBar: {
          position: 'relative',
          color: 'white', 
          backgroundColor: 'black'
        },
        colors: {
          backgroundColor: 'black'
        },
        title: {
          marginLeft: theme.spacing(2),
          flex: 1,
        },
    }));

    const classes = useStyles();

  
    let twitter = ''
    let email = ''
    let username = ''
    let walletAddress = ''

    const handleSavedTwitterChanges = e => {
      e.preventDefault();
      const userText = e.target.value
      console.log("userText.length", userText.length);
      console.log("userText", userText);
      twitter = userText
    }
    
    const handleSavedEmailChanges = e => {
      e.preventDefault();
      const userText = e.target.value
      console.log("userText", userText);
      email = userText
    }


    const handleSavedNameChanges = e => {
      e.preventDefault();
      const userText = e.target.value
      console.log("userText", userText);
      username = userText
    }

    const handleSavedENSChanges = e => {
      e.preventDefault();
      const userText = e.target.value
      console.log("userText", userText);      
      walletAddress = userText;
    }

    const handleReserveButton = async () => {
      Mixpanel.buttonPressed('reserve button');
            const userData ={
              "name": username,
              "email": email,
              "ens": walletAddress ? walletAddress : 'no ENS added',
              "number": 'no number',
              "twitter": twitter
  
            }
  
            const ENDPOINT = `${process.env.NEXT_PUBLIC_url_path}/v1/add`
            try {
              const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...userData }),
              });
              if(res.ok){
                setSubmissionSuccessful(true);
                Mixpanel.track("reservation result", "reservation successful");
              } else {
                setSubmissionSuccessful(false);
                console.log("something happened, POST call didnt work...");
                Mixpanel.track("reservation result", "reservation unsuccessful");
              }
            } catch (error) {
              console.log("somethings wrong on POST", error);
              Mixpanel.track("reservation result", "reservation unsuccessful");
            }
      }




  const handleSubmission = async (value) => {
      setLoading(true);
      Mixpanel.buttonPressed('unlock submission')
      if(value.length === 42 ){
        const ENDPOINT = `${process.env.NEXT_PUBLIC_url_path}/v1/address?convert=${value}`
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
             setRequested(true);
             Mixpanel.track("successful submission", "address conversion")
             
          }
        } catch (error) {
          console.log("somethings up bro...: ", error);
          Mixpanel.track("unsuccessful submission", "address not converted")
          setLoading(false);
        }
      } else {
        const ENDPOINT = `${process.env.NEXT_PUBLIC_url_path}/v1/ens?convert=${value}`
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
             setRequested(true);
             Mixpanel.track("successful submission", "ens conversion")
          }
        } catch (error) {
          setInvalidAddress(true);
          Mixpanel.track("unsuccessful submission", "ens not converted")
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


  const mainView = () => {
    const handleUnlockEns = () => {
      console.log("handleUnlockENS!");
      Mixpanel.buttonPressed('Youtube Video Clicked');

    }


    const handleVideoEvents = () => {
      console.log("video event fired!")
    }

    if(dialogOpen === false ){
    return(
      <div className='container' style={{
        backgroundImage: `linear-gradient(rgba(45, 175, 230), rgba(60, 255, 60))`
      }}>
        <Head>
          <title>2 Way Converter</title>
          <meta name="description" content="unlock ENS" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5%'}}>
          <Link  href={'https://www.youtube.com/watch?v=ecEtqCqw8d8&ab_channel=CamBurley'} >
              <h4 style={{ fontSize: '45px', cursor: 'pointer'}} onClick={handleUnlockEns}>
                {`🔓 unlock ENS`}
              </h4>
          </Link>
          
        </div>
        <main className={styles.main}>
          
        {/* add input  */}
          <div style={{ width: '90%'}}>
          <Input placeholder='Add ENS or Wallet Address...' onClick={handleClickInput} onKeyDown={handleKeyDown} onChange={handleAddingFieldvalue} value={inputValue} style={ 
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
          </div >
          { invalidAddress ? 'hmmm seems like the address/ens isnt valid or not connected to an active wallet' : 
          <div style={{ marginTop: '10px'}}>
            <span style={{ width: '90%', paddingRight: '10%'}}>
              {converted && converted !== null ? converted : '' }
            </span>
          </div>
          }

          {
            !loading ? <Button onClick={() => handleSubmission(inputValue) } loading={loading === true ? loading : false } >Send</Button> : '...'
          }

          { requested ? <Button style={{ border: '1px solid transparent', color: `linear-gradient(rgba(45, 175, 230), rgba(60, 255, 60))`, backgroundColor: 'white', width: '40%' }} onClick={() => setDialogOpen(true)} >Reserve</Button> : ''} 
      </main>
      </div>
    )
  } else {
    Mixpanel.pageView('reserve page');
    return(
      <>
      <div className={`WidgetContainer`} style={{ backgroundColor: 'red', position: 'absolute', marginTop: '35px', paddingTop: '20px', display: 'block', height: '85vh'}}>
      
      <Dialog fullScreen open={true} TransitionComponent={Transition} className={classes.colors}>
          <AppBar className={classes.appBar}>
          <Toolbar className={classes.color}>
            <IconButton edge="start" color="inherit" onClick={() => setDialogOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            </Toolbar>
            </AppBar>
                <DialogContent className={'dialogContainer'} style={{ position: 'relative',
                  zIndex: '300000', backgroundColor: 'black'
                  }}>
                      
                  <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    { submissionSuccessful ? 
                    <>
                    <h1 style={{ color: 'white'}}>🌈 Got it!</h1>
                    </>
                    :  <div style={{ }}>
                      <h4 style={{ color: 'white'}}> Reserve your space. Get the Alpha 🪄</h4>
                        <Input placeholder='@twitter' onClick={() => console.log('user clicks on twitter ')}   onChange={(handleSavedTwitterChanges)} value={savedTwitter} style={{ backgroundColor: 'white', borderColor: 'white'}}  />
                        <Input placeholder='your@email.com' onClick={() => console.log('user clicks on email')} onChange={handleSavedEmailChanges} value={savedEmail} style={{ backgroundColor: 'white', borderColor: 'white'}}  />
                        <Input placeholder='choose a username' onClick={() => console.log('user clicks on name')} onChange={handleSavedNameChanges} value={savedName} style={{ backgroundColor: 'white', borderColor: 'white'}}  />
                        <Input placeholder='ENS/Address (optional)' onClick={() => console.log('user clicks on ens')} onChange={handleSavedENSChanges} value={savedENS} style={{ backgroundColor: 'white', borderColor: 'white'}}  />
                        <div style={{ marginTop: '10px'}}><Button onClick={ handleReserveButton } style={{ backgroundImage: `linear-gradient(rgba(45, 175, 230), rgba(60, 255, 60))`, color: 'black', borderRadius: '0px', width: '100%'}}>Reserve</Button></div>
                    </div>}
                  </div>
                </DialogContent>
      </Dialog>



      </div>
      </>
    )
  }
  }

  useEffect(() => {
    Mixpanel.pageView('Unlock Home')
  }, []);

    useEffect(() => {
    }, [savedTwitter, setSavedTwitter]);

    useEffect(() => {
      console.log("requested", requested)
    }, [requested, setRequested]);

  return mainView();
  
}










