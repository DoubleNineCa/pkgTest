const { throws } = require("assert");
const { exec } = require("child_process");
const prompt = require("prompt-sync")();
const client = require('./utils/DBConnection');

const main = async () => {
    let isValidated = false;
    client.connect();
    while(!isValidated){
        const employeeId = prompt("Input your employee ID > ");

        try{
            if(employeeId.length > 5){
                throw new Error('Cannot exceed 5 digits');
            }

            const qry = `SELECT * FROM users where eid='${employeeId}'`;

            const res = await client.query(qry);

            if(res.rowCount > 0) {
                isValidated = true;
                const hostname = await new Promise((res, rej) => {
                    exec('$env:computername', {'shell': 'powershell.exe'}, (err, stdout) => {
                        if(!err){
                            res(stdout.trim());
                        }else{
                            rej(err);
                        }
                    })
                });

                const user = res.rows[0];
                const revisedHostname = user.estatus + user.dept_cd + "-" + user.eid;

                if(hostname != revisedHostname){
                    console.info("Your hostname is invalid and will be updated by system.");
                    const restart = prompt("Do you want to restart right away or later[N]?");
                    const command = restart.toLocaleLowerCase() !== 'n' ? `rename-computer -newname "${revisedHostname}" -restart` : `rename-computer -newname "${revisedHostname}"`;
                    exec(command, {'shell': 'powershell.exe'}, (err, stdout) => {
                        if(err){
                            console.log(err.message);
                            if(err.message.includes("Access is denied")){
                                console.log("Please try run this again as administrator.");
                            }
                        }else{
                            console.log(stdout);
                        }
                    });
                }
            }else {
                console.log("===============Invalid data===============");
            }

        }catch(err){
            console.log(err);
        }
    }
    
    client.end();    
}

main();

