const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js'); 
const Discord = require('discord.js')
var Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})    

const prefix = "*";

let nbTicket = 0;

Client.on("ready", () => {
/*
    const openbuttonticket = new Discord.MessageEmbed()
        .setTitle('Passer commande')
        .setColor("#418A4F")
        .setDescription ("Appuyez sur le bouton pour ouvrir un ticket")

        var row = new MessageActionRow()
            .addComponents(new Discord.MessageButton()
                .setCustomId("open-ticket")
                .setLabel("Ouvrir un ticket")
                .setStyle("SUCCESS")              
            );

    Client.channels.cache.get("1013059504130248795").send({embeds: [openbuttonticket], components: [row]}) 
        */
    console.log("bot opérationnel");
});

Client.on ("interactionCreate", interaction => {
    if(interaction.isButton()){
        if(interaction.customId === "open-ticket"){
            nbTicket++;

                interaction.guild.channels.create("ticket-" + nbTicket,{
                    parent: "1013375019495207012",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                        },
                        {
                            id: interaction.user.id,
                            allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                        }   
                   ]
               
               }).then(channel => {
                    const closebuttonticket = new Discord.MessageEmbed()
                    .setTitle('Fermer le ticket')
                    .setColor("#418A4F")
                    .setDescription ("Appuyez sur le bouton pour fermer le ticket")


                var row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                        .setCustomId("close-ticket")
                        .setLabel("Fermer le ticket")
                        .setStyle("SUCCESS")
                    );

                channel.send({content: "<@" + interaction.user.id + ">", embeds: [closebuttonticket], components: [row]});

                interaction.reply({content: "Ticket correctement crée", ephemeral: true });
            })
        }
        else if(interaction.customId === "close-ticket"){
            interaction.channel.setParent("1013375019495207012");
            const deletebuttonticket = new Discord.MessageEmbed()
            .setTitle('Supprimer le ticket')
            .setColor("#418A4F")
            .setDescription ("Appuyez sur le bouton pour supprimer le ticket")

            var row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                    .setCustomId("delete-ticket")
                    .setLabel("Supprimer le ticket")
                    .setStyle("SUCCESS")
                );
            interaction.message.delete();

            interaction.channel.send({embeds: [deletebuttonticket], components: [row]});

            interaction.reply({content: "Ticket archivé", ephemeral: true});
        }
        else if(interaction.customId === "delete-ticket"){
            interaction.channel.delete();

            interaction.reply({content: "Ticket supprimé", ephemeral: true});
        }
    }
})




Client.login(process.env.TOKEN);

Client.on("messageCreate", message => {
    if (message.author.bot) return;
    

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    if(message.content.startsWith(prefix +'setname')){
        const cantrename = new Discord.MessageEmbed()
            .setTitle("Tu ne peux pas faire ça")
            .setColor("#418A4F")
            .setDescription("Tu n'es pas autorisé a renomer le channel")
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply({embeds: [cantrename]})

        let name = args[1]
        const renameticket = new Discord.MessageEmbed()
        .setTitle("Le ticket a été renomé")
        .setColor("#418A4F")
        .setDescription(`Ticket renomé par ${message.member}`)
        message.channel.setName(name)
        message.channel.send({embeds: [renameticket]})
    }


    //*help
    if(message.content === prefix + "help"){
       const embed = new Discord.MessageEmbed()
            .setTitle("Liste des commandes")
            .setColor("#418A4F")
            .setDescription("*Ban : Bannir un membre \n *Kick : Kick un membre \n *Mute : Mute un membre \n *Tempmute @utilsateur (temps en secondes) \n*Setname [name]: nommer un ticket")
            .setThumbnail("https://media.discordapp.net/attachments/1008771727058288720/1013508714159931523/apuu.png?width=676&height=676");

        message.channel.send({ embeds: [embed]});   
    }
    if(message.member.permissions.has("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();
            const banmessage = new Discord.MessageEmbed()
                .setTitle("Bannissement")
                .setColor("#418A4F")
                .setDescription(`${mention} banni avec succés`);

                const failbanmessage = new Discord.MessageEmbed()
                    .setTitle("Bannissement échoué")
                    .setColor("#A71805")
                    .setDescription("Le bannissement est impossible");
                    const voidban = new Discord.MessageEmbed()
                        .setTitle("Bannissement introuvable")
                        .setColor("#FFB732")
                        .setDescription("Membre introuvable");

            if(mention == undefined){
                message.reply({embeds: [voidban]});
            }
            else {
                if(mention.bannable){
                    mention.ban();
                    message.channel.send({embeds: [banmessage]})
                }
                else {
                    message.reply({embeds: [failbanmessage]})
                }
            }
        };

        if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();
            const failkick = new Discord.MessageEmbed()
            .setTitle("Kick échoué")
            .setColor("#FFB732")
            .setDescription("Membre introuvable");
                const kickmessage = new Discord.MessageEmbed()
                .setTitle("Kick")
                .setColor("#418A4F")
                .setDescription(`${mention} kick avec succés`);

            if(mention == undefined){
                message.reply({embeds: [failkick]});
            }
            else {
                if(mention.kickable){
                    mention.kick();
                    message.channel.send({embeds: [kickmessage]});      
                }
            }
        }
        if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first()
                const failmute = new Discord.MessageEmbed()
                    .setTitle("Echec")
                    .setColor("#FFB732")
                    .setDescription("Membre introuvable");
                        const mutesuccess = new Discord.MessageEmbed()
                            .setTitle("Mute réalise avec succès")
                            .setColor("#418A4F")
                            .setDescription(`${mention} à été mute`);
                    
            if(mention == undefined){
                message.reply({embeds: [failmute]});
            }
            else {
                mention.roles.add("1012303197165068370");
                message.channel.send({embeds: [mutesuccess]});
            }
            
           
        }   
            if(message.content.startsWith(prefix + "unmute")){
                let mention = message.mentions.members.first()
                    const unfailmute = new Discord.MessageEmbed()
                        .setTitle("Echec")
                        .setColor("#FFB732")
                        .setDescription("Unmute échoué");
                            const unmutesuccess = new Discord.MessageEmbed()
                                .setTitle("Unmute réalise avec succès")
                                .setColor("#418A4F")
                                .setDescription(`${mention} à été unmute`);

                if(mention == undefined){
                    message.reply({embeds: [unfailmute]});
                }
                else {
                    mention.roles.remove("1012303197165068370");
                    message.channel.send({embeds: [unmutesuccess]});
                }
            }
            else if(message.content.startsWith(prefix + "tempmute")){
                let mention = message.mentions.members.first();
                    const failtempmute = new Discord.MessageEmbed()
                        .setTitle("Echec")
                        .setColor("#FFB732")
                        .setDescription("Membre introuvable");
                            const tempmute = new Discord.MessageEmbed()      
                                .setTitle("Mute temporaire réalisé avec succés")
                                .setColor("#418A4F")
                                .setDescription(`${mention} à été mute temporairement`);

                if(mention = undefined){
                    message.reply({embeds: [failtempmute]});

                }
                else {
                    let args = message.content.split(" ");
                    let mention = message.mentions.members.first();
                        const untempmute = new Discord.MessageEmbed()
                            .setTitle("Unmute")
                            .setColor("#418A4F")
                            .setDescription("Tu es démute !")


                 mention.roles.add("1012303197165068370");
                 message.channel.send({embeds: [tempmute]})
                    setTimeout(function() {
                        mention.roles.remove("1012303197165068370");
                        message.channel.send({content:"<@" + mention.id + ">", embeds: [untempmute]})
                       },  args[2] * 1000)
                }
            }
    }
});
