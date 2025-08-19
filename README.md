# Collabify
## **Step 5: Backend Invite Acceptance & Transaction**

### **5.1 Validation**

- Check `ProjectInvite`:
    
    - Exists
        
    - Status is `pending`
        
    - `invitedUserId` matches current user
        
    - Not expired
        

### **5.2 Start Prisma `$transaction`**

- All steps inside transaction:
    

1. **Create ProjectMember**
    
    - Add user to project members with `permissions` and `joinedAt`.
        
2. **Update Project**
    
    - Add userId to `Projects.members` array.
        
3. **Update User**
    
    - Add projectId to `Users.projects` array.
        
4. **Update Invite**
    
    - Status = `accepted`
        
    - `acceptedAt` = now
        
5. **Create Notification for Inviter**
    
    - Type: `update`
        
    - Content: `"User X accepted your invite to project Y"`
        

`await prisma.$transaction(async (tx) => {   const member = await tx.projectMember.create({...});   await tx.projectInvite.update({...});   await tx.notification.create({...}); });`

- **Atomicity:** if any step fails → all rolled back.
    

---

## **Step 6: Backend Response**

- Return updated project and member info:
    

`{   project: { id, name, members: [...] },   member: { id, userId, projectId, joinedAt, permissions } }`

---

## **Step 7: Frontend Updates After Accepting Invite**

1. **Update notification state**:
    
    - Mark invite notification as **read/accepted**.
        
    - Optionally remove it from the list.
        
2. **Update project members UI** (if showing current project page):
    
    - Add the user to members list.
        
3. **Show toast / feedback**:
    
    - `"You joined project XYZ"`.
        
4. **Optional: real-time update**
    
    - Using **WebSockets / Pusher / AppSync**, push an event to inviter → notification appears instantly.
        