
<template>
    <div>
      <div class="card">
        <div class="card-body">
         
     <div class="termsAndConditions fadeIn">
      <h1 class="termsAndConditionsHeading">Terms and Conditions for Idea Submission</h1>
      <h4 class="spangleWelcome">Welcome to Think Space </h4>
      <p class="termsParagraphIntro">By submitting an idea through this system, you agree to the following: <br><br>
       
      </p>    
      <div class="serviceLeadingSection">
        <h4><span class="sn blue">1.</span><span class="st blue">Data Collection and Use:</span></h4>
        <p class="spl">You acknowledge that the University will collect and store 
            information submitted through this system, including your idea, any supporting documents,
             and your contact information.</p>
        <div class="serviceInfoContainer">
          <h6 class="serviceLead">Data Usage</h6>
          <p class="serviceDetails">Your submitted information (ideas, documents, contact details) will be stored by the University.
            This data may be used to improve University operations and services. <br>
            Anonymized data may be shared for research purposes.</p>
          <div class="secionLine lineColorBlue"></div>
        </div>
                                      
      </div>

      <div class="serviceLeadingSection">
        <h4><span class="sn orange">2.</span><span class="st orange">Confidentiality</span></h4>
        <p class="spl">While the system allows for anonymous idea submissions, the University reserves the right to investigate and disclose the identity of the submitter if necessary to address any concerns regarding the content of the idea, such as inappropriate or harmful content.</p>
        <div class="serviceInfoContainer">
          <h6 class="serviceLead">Confidentiality</h6>
          <p class="serviceDetails">While submissions can be anonymous, the University may reveal your identity if necessary.
            You agree to use the system responsibly and ethically. <br>
            Avoid submitting harmful, misleading, or infringing content..</p>
          <div class="secionLine lineColorOrange"></div>
        </div>
               
      </div>
      <div class="serviceLeadingSection">
        <h4><span class="sn lightGreen">3.</span><span class="st lightGreen">Disclaimer</span></h4>
        <p class="spl">The University does not guarantee that any submitted ideas will be implemented.
            The University is not responsible for any damages or losses that may result from the submission or implementation of any ideas.</p>
        <div class="serviceInfoContainer">
          <h6 class="serviceLead">Disclaimer</h6>
          <p class="serviceDetails">The University doesn't guarantee idea implementation.
            The University is not liable for any damages related to submissions.
            </p>
          <div class="secionLine lineColorGreen"></div>
        </div>
         
      </div> 
      <div class="serviceLeadingSection">
        <h4><span class="sn lightGreen">4.</span><span class="st lightGreen">Changes</span></h4>
        <p class="spl">The University reserves the right to modify these Terms and Conditions at any time.
            Continued use of this system after any changes to these Terms and Conditions constitutes your acceptance of such changes.</p>
        <div class="serviceInfoContainer">
          <h6 class="serviceLead">Changes</h6>
          <p class="serviceDetails">These terms may be updated.Continued use implies acceptance of any changes.
            </p>
          <div class="secionLine lineColorGreen"></div>
        </div>
         
      </div> 
      <div class="serviceLeadingSection">
        <h4><span class="sn purple">5.</span><span class="st purple">Accountability</span></h4>
        <p class="spl">You are solely responsible for the content of any ideas you submit.
            The University reserves the right to remove or modify any submissions that violate these Terms and Conditions.</p>
        <div class="serviceInfoContainer">
          <h6 class="serviceLead">Accountability</h6>
          <p class="serviceDetails">You're responsible for your submitted content.The University may remove or modify violating submissions</p>
          <div class="secionLine lineColorPurple"></div>
        </div>
        
        <br>
      </div>    
      <h4 class="closeTerms">CLOSE TERMS AND CONDITIONS</h4>
    </div>
    </div>
    </div>
    </div>
</template>

<style>


.termsAndConditionsHeading{
  margin-top: 70px;
  margin-bottom: 30px;
  font-size: 32px;
}
.termsParagraphIntro{
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.spangleWelcome{
  font-weight: 500;
}
.serviceLeadingSection{
  width: 80%;
  margin-top: 15px;
  margin-bottom:15px;
}
.sn{
  font-size: 32px;
  padding-right: 5px;
}
.st{
  font-size: 32px;
}
.spl{
  margin-top: 15px;
  margin-bottom: 15px;

}
.serviceInfoContainer{
  position:relative;
  width: 100%;    
}
.serviceLead{
  font-weight: 700;
  margin-left: 15px;  
  margin-top: 15px;
  margin-block-end: 5px;  

}
.serviceDetails{
  margin-left: 15px;
}

.displayNone{
  display:none;
}
.secionLine{
  height: 40px;
  width:5px;

  position:absolute;
  top:7px;
}
/*Font Colours below*/
.lightGreen{
  color: rgb(85, 189, 134);
}
.blue{
  color: #2998ff;
}
.orange{
  color: #ff7730;
}
.purple{
  color: #2a0073
}
.red{
    color: #5d1010;
}
/*Set the colours for the lines*/

.lineColorGreen{
  background-image: linear-gradient(to right bottom, rgb(85, 189, 134), rgb(11, 103, 92));
}
.lineColorBlue{
  background-image: linear-gradient(to right bottom, #2998ff, #5643fa);
}
.lineColorOrange{
  background-image: linear-gradient(to right bottom, #ffb900, #ff7730);
}
.lineColorPurple{
  background-image: linear-gradient(to bottom right, #b25f88, #2a0073)
}
.lineColor
.closeTerms{
  border-bottom: 1px solid black;
  margin-top: 15px;
  margin-bottom: 15px;
  padding-bottom: 5px;
}
.fadeIn{
  animation-name: fadeIn;
  animation-duration: .8s;
  animation-timing-function: ease-out;
  z-index: 1001;
}

@keyframes fadeIn{
  0% {

    opacity: 0;
  }
  100%{

    opacity: 1;
  }
}
 </style>