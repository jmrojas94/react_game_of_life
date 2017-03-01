import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';

const events = {};

const Cell = React.createClass({
  getInitialState() {
    return {selected: false, nextState: false}
    
  },
  isSelected(row, column) {
    const size = Math.sqrt(this.props.cells.length);

    if(row == -1) row = size - 1
    if(row == size) row = 0
    
    if(column == -1) column = size - 1
    if(column == size) column = 0
    
    const id = row * size + column;            
    return this.props.cells[id].state.selected
    
  },
  calculate() {
    let neighbours = 0;
    const size = Math.sqrt(this.props.cells.length);
    const row = Math.floor( this.props.id / size );
    const column = this.props.id - row * size; 
    
    // calculate number of neighbours
    //
    if( this.isSelected( row - 1, column ) ) neighbours += 1
    if( this.isSelected( row - 1, column + 1 ) ) neighbours += 1
    if( this.isSelected( row - 1, column - 1 ) ) neighbours += 1
    
    if( this.isSelected( row, column + 1 ) ) neighbours += 1
    if( this.isSelected( row, column - 1 ) ) neighbours += 1
    
    if( this.isSelected( row + 1, column ) ) neighbours += 1
    if( this.isSelected( row + 1, column + 1 ) ) neighbours += 1
    if( this.isSelected( row + 1, column - 1 ) ) neighbours += 1   
    
    // assign cell a nextState based on number of neighbours 
    //  
    this.state.nextState = false 
    if( this.state.selected ){
      if( neighbours < 2) this.state.nextState = false
      if( neighbours > 3) this.state.nextState = false      
      if( neighbours == 3 || neighbours == 2) this.state.nextState = true
      
    }else{
      if( neighbours == 3) this.state.nextState = true      
      
    }
    
  },
  renderNext() {
    this.setState({selected: this.state.nextState})     
    
  },
  componentDidMount() {
    this.props.cells[this.props.id] = this  // place cell as object in global array 
    $(events).on("calculate", this.calculate)  // subscribe to calculate event
    $(events).on("renderNext", this.renderNext)
    
  },
  onclick(e) {
    this.setState({selected: !this.state.selected})  // toggle state on click
    
  },
  render() {             
        return (
          <div className={this.state.selected?"cell active":"cell"}
               onClick={this.onclick} >
          </div>
        )    
  }
});

const Box = React.createClass({
    getInitialState() {
      
      // build an array to hold all the cells
      //
      const c = [];  
      for(let i=0; i<100; i++){ 
        c.push( <Cell key={i} id={i} cells={c} /> )
      }
      return {cells: c} 
      
    },
    render() {               
        return (
          <div> { this.state.cells } </div>
        )    
    }
});

// calculate and render next state on spacebar press  
//
$(document).keydown(e => {  
  if( e.which == 32){  // space   
    $(events).trigger("calculate")
    $(events).trigger("renderNext")
    
  }
})

ReactDOM.render(
  <Box />,
  document.getElementById('root')
);