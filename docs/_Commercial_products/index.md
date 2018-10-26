# Commercial product

If you want your commercial product to speak the Homie MQTT dialect,
please fill in the contact form. Active maintainers will receive
a message and assist you in getting your implementation right and
answering any upcoming questions.

<form action="#" autocomplete="off" class="partnerform">
<fieldset>
  <input id="first" type="text" name="first" required>
  <label for="first">E-Mail address</label>
  <div class="after"></div>
</fieldset>
<fieldset>
  <input id="last" type="text" name="last" required>
  <label for="last">Your name</label>
  <div class="after"></div>
</fieldset>
<fieldset>
  <button>Submit</button>
</fieldset>
</form>

<style> nav.md-nav { display: none !important; } </style>

<style>

.partnerform fieldset {
  position: relative;
  border: none;  
}

.partnerform label {
  position: absolute;  
  top: 18px;
  color: rgba(0, 0, 0, 0.3);
  transform-origin: left;
  transition: all 0.3s ease;
}

.partnerform input:focus ~ label {
  color: red;  
}

.partnerform input:focus ~ label,
.partnerform input:valid ~ label {
  top: 0;
  transform: scale(0.6, 0.6);
}

.partnerform input {
  font-size: 20px;  
  width: 100%;
  border: none;  
  margin-top: 10px;
}

.partnerform input:focus {
  outline: none;
}

.partnerform .after {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, red 50%, transparent 50%);
  background-color: rgba(0, 0, 0, 0.3);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: all 0.6s ease;
}

.partnerform input:focus ~ .after {
  background-position: 0 0;
}

.partnerform button {
  position: relative;
  width: 100%;
  font-size: 20px;  
  font-family: system-ui, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  margin-top: 20px;
  padding: 2px 10px;
  color: rgba(0, 0, 0, 0.4);
  background: white;
  border: none;
  background: linear-gradient(to right, #3f51b5 50%, transparent 50%);
  background-color: rgba(0, 0, 0, 0.3);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: all 0.6s ease;
}

.partnerform button:before {
  position: absolute;
  content: "Submit";
  top: 2px;
  bottom: 2px;
  left: 2px;
  right: 2px;
  display: block;
  background-color: white;
}

.partnerform button:active,
.partnerform button:focus,
.partnerform button:hover {
  outline: none;
  background-position: 0 0;
  color: #3f51b5;
}
</style>
