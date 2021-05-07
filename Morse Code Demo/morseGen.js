class MorseCodeGenerator{
  constructor(){
    this.map = {
      'a' : ".-",    'b' : "-...",   'c' : "-.-.",   'd' : "-..",    'e' : ".",    
      'f' : "..-.",  'g' : "--.",    'h' : "....",   'i' : "..",     'j' : ".---",
      'k' : "-.-",   'l' : ".-..",   'm' : "--",     'n' : "-.",     'o' : "---",
      'p' : ".---.", 'q' : "--.-",   'r' : ".-.",    's' : "...",    't' : "-",    
      'u' : "..-",   'v' : "...-",   'w' : ".--",    'x' : "-..-",   'y' : "-.--",
      'z' : "--..",  '1' : ".----",  '2' : "..---",  '3' : "...--",  '4' : "....-",
      '5' : ".....", '6' : "-....",  '7' : "--...",  '8' : "---..",  '9' : "----.",
      '0' : "-----", ',' : "--..--", '.' : ".-.-.-", '?' : "..--..", ' ' : "  ",
    };

    this.prefxEngl = "English:    ";
    this.prefxMors = "Morse Code: ";

    this.sent_engl = ""; //"all your base are belong to us";
    this.sent_mors = "";
    this.sentenceToConsole(this.sent_engl);
  }

  sentenceToConsole(s){
    let sent = "";
    for (var i = 0; i < s.length; i++) {
      sent += this.map[s.charAt(i)];
      if(i<s.length-1){sent+="  ";}
    }
    console.log(sent);
    this.sent_engl = s;
    this.sent_mors = sent;
  }

  render(){
    let rand = noise(frameCount*0.1);

    stroke(lerp(255,120,rand));
    fill(lerp(120,255,rand));

    let h2 = height/2;

    line(0,h2,width,height/2);

    textSize(32);text(this.prefxEngl,16,32);
    textSize(24);text(this.sent_engl,32,48,width-32,h2-32);

    textSize(32);text(this.prefxMors,16,h2+32);
    textSize(24);text(this.sent_mors,32,h2+48,width-32,height-32);
  }

} // Ends Class MorseCodeGenerator