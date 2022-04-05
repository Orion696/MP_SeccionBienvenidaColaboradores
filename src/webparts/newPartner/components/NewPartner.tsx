import * as React from 'react';
import  { useState, useEffect} from 'react';
import styles from './NewPartner.module.scss';
import { INewPartnerProps } from './INewPartnerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { LivePersona } from '@pnp/spfx-controls-react';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import {useBoolean } from '@fluentui/react-hooks';
import { DefaultPalette, IStackStyles, IStackTokens, PrimaryButton, Stack } from '@fluentui/react';
import Carousel from "react-multi-carousel";
import { Text, ITextProps } from '@fluentui/react/lib/Text';
import "react-multi-carousel/lib/styles.css";
import { TitleFieldLabel } from 'NewPartnerWebPartStrings';
import * as moment from 'moment';

const  newPartner= (props,{})=>{
  const[state,setState]=useState({data:[]})
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const {context,ListName,Count,description} = props;
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Lista invalida',
    closeButtonAriaLabel: 'Close',
    subText: 'Algunas de las columnas de las lista no coincide, por favor verifique',
  };
  const sp = spfi().using(SPFx(context));
  useEffect(() => {
   async function fecthData(){
     let getData:[];
     let cantidad=Count==undefined?4:parseInt(Count);
     if(ListName!=undefined){
       try {        
        getData=await sp.web.lists.getByTitle(ListName).items.orderBy("FechaIngreso", false).select("InformacionUsuario/Title,InformacionUsuario/EMail,InformacionUsuario/JobTitle,FechaIngreso, Title").expand("InformacionUsuario").top(cantidad)() 
        console.log(getData,);
        setState({ data:getData })
      } catch (error) {
        toggleHideDialog();
        console.log(error);
      }
    }
   }
   fecthData();
  }, [ListName,Count]) 

 
const _onConfigure = () => {
  // Context of the web part
  props.context.propertyPane.open();
}
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.themeTertiary,
  },
};
const verticalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

return (<>
  {ListName==undefined?
  <Placeholder iconName='Edit'
  iconText='Configura el webpart'
  description='Por favor configura la fuente de datos y la cantidad a mostrar'
  buttonLabel='Configurar'
  onConfigure={_onConfigure} />
  
 :<section className={`${styles.newPartner}`}>
  <h3>Bienvenidos nuevos colaboradores</h3>
  <Carousel
  swipeable={false}
  draggable={false}
  showDots={true}
  responsive={responsive}
  autoPlay={props.deviceType !== "mobile" ? true : false}
  ssr={true} // means to render carousel on server-side.
  infinite={true}
  autoPlaySpeed={5000}
  keyBoardControl={true}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  dotListClass="custom-dot-list-style"
  itemClass="carousel-item-padding-40-px"
>
  {state.data.map((item) => (<LivePersona upn={item.InformacionUsuario.EMail}
     template={
       <>
         <Persona 
           imageUrl={`/_layouts/15/userphoto.aspx?size=L&username=${item.InformacionUsuario.EMail}`} 
           coinSize={120} />
           <Stack  tokens={verticalGapStackTokens}>
            <h3>{item.InformacionUsuario.Title}</h3>
            <Text variant='medium'>{item.InformacionUsuario.JobTitle!=null?item.InformacionUsuario.JobTitle:item.Title}</Text>
            <h5>{moment(item.FechaIngreso).format('ll')}</h5>      
          </Stack>
       </>
     }
     serviceScope={context.serviceScope}
   />
  ))}
   </Carousel>
</section> }
<Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
         >
        <DialogFooter>
          <PrimaryButton onClick={toggleHideDialog} text="Entendido" />          
        </DialogFooter>
      </Dialog>
  </>);
}
export default newPartner;