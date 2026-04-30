require('dotenv').config();

const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1497714649611763752';
const GUILD_ID = '1497301652758073354';
const CHANNEL_ID_INDBETALING = '1498701080270213120';
const CHANNEL_ID_TELEFON = '1497707275299586058';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

if (!TOKEN) {
    throw new Error("Missing TOKEN in environment variables");
}

console.log("TOKEN FROM RAILWAY:", process.env.TOKEN);

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'indbetaling') {
        const kommentar = interaction.options.getString('kommentar');
        const beskrivelse = interaction.options.getString('beskrivelse');
        const beløb = interaction.options.getInteger('beløb');

        const channel = await client.channels.fetch(CHANNEL_ID_INDBETALING);

        await channel.send(
            `Bruger: ${interaction.user.username} | ` +
            `Kommentar: ${kommentar} | ` +
            `Beskrivelse: ${beskrivelse} | ` +
            `Beløb: ${beløb}`
        );

        await interaction.reply({ content: '✅ Sendt!', ephemeral: true });
    }

    if (interaction.commandName === 'dokumenter') {

        await interaction.reply({
            content:
                `🔥 **Flames dokumenter!**

📊 Flames sheets:
https://docs.google.com/spreadsheets/d/1zBreMg2c8WL0YU9uzjr7K-TqKe6_zZLdqFWqdEDvvIY/edit?usp=sharing

📈 Flames KD sheet:
https://docs.google.com/spreadsheets/d/1L5HoLr-Ipir7SZpQJVwT1l2hdN0f-BDUVg8upYLCVdY/edit?usp=sharing`,
            ephemeral: false
        });
    }

    if (interaction.commandName === 'telefon') {
        const navn = interaction.options.getString('navn');
        const nummer = interaction.options.getString('nummer');

        const channel = await client.channels.fetch(CHANNEL_ID_TELEFON);

        const { EmbedBuilder } = require('discord.js');

        const embed = new EmbedBuilder()
            .setTitle('📱 Telefon register')
            .setDescription(
                `**Navn:** ${navn}\n` +
                `**Nummer:** ${nummer}`
            )
            .setColor(0x5865F2)
            .setFooter({ text: `Tilføjet af ${interaction.user.username}` })
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        await interaction.reply({
            content: '✅ Nummer gemt!',
            ephemeral: true
        });
    }
});

const commands = [
    new SlashCommandBuilder()
        .setName('indbetaling')
        .setDescription('Opret en indbetaling')
        .addStringOption(opt =>
            opt.setName('kommentar').setDescription('Kommentar').setRequired(true))
        .addStringOption(opt =>
            opt.setName('beskrivelse').setDescription('Beskrivelse').setRequired(true))
        .addIntegerOption(opt =>
            opt.setName('beløb').setDescription('Beløb').setRequired(true)),

    new SlashCommandBuilder()
        .setName('dokumenter')
        .setDescription('Vis Flames dokumenter'),

    new SlashCommandBuilder()
        .setName('telefon')
        .setDescription('Tilføj et telefonnummer')
        .addStringOption(opt =>
            opt.setName('navn').setDescription('Navn').setRequired(true))
        .addStringOption(opt =>
            opt.setName('nummer').setDescription('Telefonnummer (xx xx xx xx)').setRequired(true))

].map(c => c.toJSON());


const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );

    console.log('Slash command registered');
})();

client.login(TOKEN);