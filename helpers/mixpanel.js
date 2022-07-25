import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN);


let actions = {
  identify: (id) => {
   return mixpanel.identify(id);
  },
  buttonPressed: ( buttonId ) => {
    return mixpanel.track('Button Pressed', 
        { 
          "button_id": buttonId,
        });
  },
  pageView: (page_id) => {
    return mixpanel.track('Page View', 
        { 
            "page_id": page_id
        });
  },
  alias: (id) => {
   return mixpanel.alias(id);
  },
  time: (timeInSeconds, duration ) => {
    console.log("timeInSeconds", timeInSeconds);
    console.log("duration", duration);
    return mixpanel.track( 'Time on Page', {
        "time_in_secs": timeInSeconds, 
        "page_id": 'RAQ Page', 
        "on_page_duration": duration ,
    });
  },
  track: (name, msg) => {
   return mixpanel.track( name, { 
    "msg": msg
  });
  },
  people: {
    set: (props) => {
    return mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;