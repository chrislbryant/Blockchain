pragma solidity ^0.5.0;

contract ProjectApproval {

    // Project Accounts  
    address payable debt           = 0x38126e7887E41C37EaF221E1Ba7F5F32b09C646e;
    address payable community_fund = 0x054602554C41b232D8F0DCF6613b8decE17aDA46;
    address payable multi_year     = 0xEc0ab680346358458C99130696038973b6805F8f;
    address payable general_fund   = 0x0fd728Ba4B80f106E58A2dDb32B3Bebac44456Bb;

    // Template for a Project
    struct Project {
        uint id;
        string name;
        uint voteCount;
        uint contractValue;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // maps ID's to projects
    mapping(uint => Project) public projects;

    // tracks project ID's
    uint public projectsCount;

    // voted event
    event votedEvent (
        uint indexed _projectId
    );

    constructor() public {
        addProject("New Wales Middle School Phase 1", 10);
    }

    // Function to add a project
    function addProject (string memory _name, uint _contractValue) private {
        projectsCount++;
        projects[projectsCount] = Project(projectsCount, _name, 0, _contractValue);
    }

    // Function to mange Voting
    function vote (uint _projectId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid project
        require(_projectId > 0 && _projectId <= projectsCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update project vote Count
        projects[_projectId].voteCount ++;

        // trigger voted event
        emit votedEvent(_projectId);
        }
        
    // Function to release funds upon project approval    
    function deposit() public payable {
    
        // splits up the funds into percentages
        uint points = msg.value / 100; // Calculates rudimentary percentage by dividing msg.value into 100 units
        uint total;
        uint amount;

        // fund debt account
        amount = points * 60;
        total += amount;
        debt.transfer(amount);

        // fund community_fund 
        amount = points *20;
        total += amount;
        community_fund.transfer(amount);
        
        // fund multi_year
        amount = points *15;
        total += amount;
        multi_year.transfer(amount);


        // fund general_fund
        amount = points *5;
        total += amount;
        general_fund.transfer(amount);
   
    }

    function() external payable {
        deposit();
    }
}