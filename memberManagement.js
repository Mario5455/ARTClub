const logAction = require('./audit-trail-log');

function addMember(administrator, username, password, contactInfo, otherData) {
    const existingMember = membersDatabase.find(member => member.username === username);
    if (existingMember) {
        console.error('Username already exists. Please choose a different username.');
        return false;
    }
    const memberId = generateUniqueId();
    
    const newMember = {
        id: memberId,
        username: username,
        password: password,
        contactInfo: contactInfo,
        otherData: otherData
    };

    membersDatabase.push(newMember);

    logAction(administrator, 'add member', `Added new member: ${username}`);

    console.log('Member added successfully:', newMember);
    return true;
}


function editMember(administrator, memberId, newData) {
    const memberIndex = membersDatabase.findIndex(member => member.id === memberId);
    if (memberIndex === -1) {
        console.error('Member not found.');
        return false;
    }

    membersDatabase[memberIndex] = { ...membersDatabase[memberIndex], ...newData };

    logAction(administrator, 'edit member', `Edited member details: ${JSON.stringify(newData)}`);

    console.log('Member details updated successfully:', membersDatabase[memberIndex]);
    return true;
}


function removeMember(administrator, memberId) {
    const memberIndex = membersDatabase.findIndex(member => member.id === memberId);
    if (memberIndex === -1) {
        console.error('Member not found.');
        return false;
    }

    const removedMember = membersDatabase.splice(memberIndex, 1)[0];

    logAction(administrator, 'remove member', `Removed member: ${removedMember.username}`);

    console.log('Member removed successfully.');
    return true;
}
