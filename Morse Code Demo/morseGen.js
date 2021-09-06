//######################################################################
//>>> MorseCodeGenerator Class Definition
//######################################################################
class MorseCodeGenerator{
  constructor(){
    this.prefxEngl = "Input Message (English):";
    this.prefxMors = "Translation (Morse Code):";
    this.sent_engl = "Enter Your Message Here";
    this.sent_mors = "";
    this.sentenceToConsole(this.sent_engl);
  } // Ends Constructor

  sentenceToConsole(s){
    s = s.toLowerCase();
    this.sent_engl = "";
    this.sent_mors = "";
    let curChar, morChar;
    for (var i = 0; i < s.length; i++) {
      curChar = s.charAt(i);
      this.sent_engl += curChar;
      this.sent_mors += this.charToMorse(curChar);
      if(i<s.length-1){this.sent_mors+="  ";}
    }
  } // Ends Function sentenceToConsole

  render(){
    let rand = noise(frameCount*0.1);
    let midH = height/2;
    stroke(lerp(255,120,rand)); fill(lerp(120,255,rand));
    line(0,midH,width,height/2);
    textSize(32); text(this.prefxEngl,16,32); text(this.prefxMors,16,midH+32);
    textSize(24); text(this.sent_engl,32,48,width-32,midH-32); text(this.sent_mors,32,midH+48,width-32,height-32);
  } // Ends Function render

  /*--------------------------------------------------------------------
  |>>> Function charToMorse : Implementation [Update] Note:                                            
  +---------------------------------------------------------------------
  | > Decided to replace the original implementation of a HashMap (via a
  |   JS object) with a mapping function utilizing a Switch Statement
  |   (perhaps the biggest one I ever wrote, but I digress); as to make
  |   the mappings clearer to see and easier to install additional ones.
  +-------------------------------------------------------------------*/
  charToMorse(curChar){
    switch(curChar){
      /*### Alphabet ###*/
      case 'a' : return ".-";
      case 'b' : return "-...";
      case 'c' : return "-.-.";
      case 'd' : return "-..";
      case 'e' : return ".";
      case 'f' : return "..-.";
      case 'g' : return "--.";
      case 'h' : return "....";
      case 'i' : return "..";
      case 'j' : return ".---";
      case 'k' : return "-.-";
      case 'l' : return ".-..";
      case 'm' : return "--";
      case 'n' : return "-.";
      case 'o' : return "---";
      case 'p' : return ".---.";
      case 'q' : return "--.-";
      case 'r' : return ".-.";
      case 's' : return "...";
      case 't' : return "-";
      case 'u' : return "..-";
      case 'v' : return "...-";
      case 'w' : return ".--";
      case 'x' : return "-..-";
      case 'y' : return "-.--";
      case 'z' : return "--..";
      /*### Numbers ###*/
      case '1' : return ".----";
      case '2' : return "..---";
      case '3' : return "...--";
      case '4' : return "....-";
      case '5' : return ".....";
      case '6' : return "-....";
      case '7' : return "--...";
      case '8' : return "---..";
      case '9' : return "----.";
      case '0' : return "-----";
      /*### (Some) Punctuation ###*/
      case ',' : return "--..--";
      case '.' : return ".-.-.-";
      case '?' : return "..--..";
      case '!' : return "-.-.--";
      case '\'': return ".----.";
      case '/' : return "-..-.";
      case ':' : return "---...";
      case ';' : return "-.-.-.";
      case '(' : return "-.--.";
      case ')' : return "-.--.-";
      case ' ' : return "  ";
      /*### Non-Supported Chars (i.e. Error) ###*/
      default  : return "........";
    } // Ends [the biggest] Switch [that I ever wrote]
  } // Ends Function charToMorse
} // Ends Class MorseCodeGenerator