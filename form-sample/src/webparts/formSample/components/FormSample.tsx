import * as React from 'react';
import styles from './FormSample.module.scss';
import { IFormSampleProps } from './IFormSampleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IFormSampleState } from './IFormSampleState';
import SearchBoxSuggestions from 'srp-react-library-js/lib/SearchBoxSuggestions';

export default class FormSample extends React.Component<IFormSampleProps, IFormSampleState> {
  constructor(props: IFormSampleProps){
    super(props); 

    this.state = {
        // The active selection's index
        activeSuggestion: 0,
        // The suggestions that match the user's input
        filteredSuggestions: [],
        // Whether or not the suggestion list is shown
        showSuggestions: false,
        // What the user has entered
        userInput: "",
        food: "",
        foodDate: "",
        foodType: "",
      };         
  }

  private async onChange(event) {     
    const inputValue = event.currentTarget.value;
    let filteredSuggestions: string[] = [];

    if (inputValue.length > 3){
        const results = await this.props.dataService.getSearchResults(inputValue);
        if (results && results.length > 0){
            results.forEach(result =>{
                filteredSuggestions.push(result.title);
            });

        }    
    }
    this.setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
        userInput: inputValue
    });
  }
  protected onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
      food: e.currentTarget.innerText
    });
  }

  protected onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  }  

  private async onButtonClick(event){
    const result = await this.props.dataService.newFood({
      food: this.state.food,
      foodDate: this.state.foodDate,
      foodType: this.state.foodType
    });
    alert(result);
  }

  private onFoodDateChange(event) {
    this.setState({foodDate: event.currentTarget.value});
  }

  private onFoodTypechange(event) {
    this.setState({foodType: event.currentTarget.value});
  }

  public render(): React.ReactElement<IFormSampleProps> {
    return (
      <div>
        <div>
            <div>
              <label className = {styles.inputLabelComida}>Comida</label>
                <SearchBoxSuggestions activeSuggestion = {this.state.activeSuggestion} 
                                    filteredSuggestions = {this.state.filteredSuggestions}
                                    showSuggestions = {this.state.showSuggestions}
                                    userInput = {this.state.userInput}
                                    onChange = {this.onChange.bind(this)}
                                    onClick = {this.onClick.bind(this)}
                                    onKeyDown = {this.onKeyDown.bind(this)}/>                        
            </div>
        </div>
        <div className = {styles.divInputcontainer}>
          <label className = {styles.inputLabel}>Fecha</label>
          <input type="Text" onChange = {this.onFoodDateChange.bind(this)} />
        </div>
        <div className = {styles.divInputcontainer}>
          <label className = {styles.inputLabel}>Tipo de comida</label>
          <input type="Text" onChange = {this.onFoodTypechange.bind(this)}/>
        </div>
        <div className = {styles.divInputcontainer}>
          <button className = {styles.buttonForm} title="Aceptar" onClick = {this.onButtonClick.bind(this)}>Aceptar</button>
        </div>

      </div>
    );
  }
}
