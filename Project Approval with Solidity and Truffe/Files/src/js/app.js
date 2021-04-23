var count;
var cost;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      const ethEnabled = () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          window.ethereum.enable();
          return true;
        }
        return false;
      }
      if (!ethEnabled()) {
        alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
      }
      web3 = window.web3;
      App.web3Provider = web3.currentProvider;
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("ProjectApproval.json", function(project) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ProjectApproval = TruffleContract(project);
      // Connect provider to interact with contract
      App.contracts.ProjectApproval.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var projectInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    $("#releaseFunds").hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.ProjectApproval.deployed().then(function(instance) {
      projectInstance = instance;
      return projectInstance.projectsCount();
    }).then(function(projectsCount) {
      var projectsResults = $("#projectResults");
      projectsResults.empty();

      var projectsSelect = $('#projectSelect');
      projectsSelect.empty();

      for (var i = 1; i <= projectsCount; i++) {
        projectInstance.projects(i).then(function(project) {
          var id = project[0];
          var name = project[1];
          var voteCount = project[2];
          var contractValue = project[3];
          count = project[2]["c"]["0"]
          cost = project[3]["c"]["0"]
          // Render project Result
          var projectTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td><td>" + contractValue + "</td></tr>";
          projectsResults.append(projectTemplate);
          // Render project ballot option
          var projectOption = "<option value='" + id + "' >" + name + "</ option>"
          projectsSelect.append(projectOption);
        });
      }
      return projectInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted && App.account === "0xc49342131131852559e733b88c1b453d8aac9e13" && count === 5) {
        $('form').hide();
        $("#releaseFunds").show();
      }
      else if(hasVoted) {
        $('form').hide();
      }
      
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var projectId = $('#projectSelect').val();
    App.contracts.ProjectApproval.deployed().then(function(instance) {
      return instance.vote(projectId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$("#releaseFunds").on("click", function(evt){
  evt.preventDefault();
  App.contracts.ProjectApproval.deployed().then(function(instance) {
    return instance.deposit({from: App.account, value:web3.toWei(`${cost}`, "ether")});
  }).then(function(result) {
    $("#releaseFunds").hide();
  })
});


$(function() {
  $(window).load(function() {
    App.init();
  });
});