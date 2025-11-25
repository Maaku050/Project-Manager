import React from "react";
import { Text } from "@/components/ui/text";
import { useUser } from "@/context/profileContext";
import { StyleSheet, useWindowDimensions } from "react-native";
import keyframes from "react-native-reanimated/lib/typescript/css/stylesheet/keyframes";

// import { useState } from "react";

type appMessageProp = {
    userId: string | undefined;
};



export default function AppMessage({ userId }: appMessageProp) {

    const { profiles } = useUser();
    const myProfile = profiles?.find((p) => p.uid === userId);
    const profileNickname = myProfile?.nickName;
    const dimensions = useWindowDimensions()
    const isLargeScreen = dimensions.width >= 1280 // computer UI condition
    const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768 // tablet UI condition

    const styles = StyleSheet.create({
    MessageFont: {
        fontSize: isLargeScreen || isMediumScreen ? 24 : 14, 
        color: "white", 
        fontWeight: isLargeScreen || isMediumScreen ? "900" : "bold" , 
        fontFamily: "roboto,",
    },
    messageAnimation: {
        width: "100%",
        flexWrap: "nowrap",
    },
});



    const messageText = {
        m1: `hello ${profileNickname}! welcome back`,
        m2: `${profileNickname}, relax ka muna, di ka hinahabol.`,
        m3: `${profileNickname}, tubig ka muna bago ka ma-dehydrate.`,
        m4: `${profileNickname}, kalma, hindi pa tapos lahat.`,
        m5: `${profileNickname}, huminga ka naman minsan.`,
        m6: `${profileNickname}, coffee ka na? mukhang kailangan mo.`,
        m7: `${profileNickname}, wag kang nerbyoso, cute ka naman.`,
        m8: `${profileNickname}, slow down, buhay ay di karera.`,
        m9: `${profileNickname}, teka, bakit ang advance mo mag-isip?`,
        m10: `${profileNickname}, chillax, may time pa para maging pogi.`,
        m11: `${profileNickname}, wag ka mag-stress, ako na bahala, jwk.`,
        m12: `${profileNickname}, pwede kang tumayo, kung gusto mo.`,
        m13: `${profileNickname}, easy lang, hindi tatakbo yung deadline.`,
        m14: `${profileNickname}, relax, di ka naman sinisingil.`,
        m15: `${profileNickname}, wag ka masyadong seryoso, di ka bagay.`,
        m16: `${profileNickname}, kalma, wala pang 13th month.`,
        m17: `${profileNickname}, mas kapuy kapa sakon haw.`,
        m18: `${profileNickname}, bakit parang galit ka? char.`,
        m19: `${profileNickname}, smile ka naman, while music is playing.`,
        m20: `Wag magmadali ${profileNickname}, pero parang late kana.`,
        m21: `${profileNickname}, breathe in, breathe out… char.`,
        m22: `${profileNickname}, tubig lang katapat niyan.`,
        m23: ` hindi ka robot ${profileNickname}, magpahinga ka.`,
        m24: `${profileNickname}, parang mag ta-transform kana ah.`,
        m25: `${profileNickname}, bakit ang cute mo ngayon?`,
        m26: `${profileNickname}, wag ka mahiya, hindi naman halata.`,
        m27: `${profileNickname}, teka lang, naglo-load pa data ko.`,
        m28: `${profileNickname}, chill, hindi ka pinapagalitan.`,
        m29: `${profileNickname}, wag kang praning, walang multo dito.`,
        m30: `${profileNickname}, easy lang, hindi maghihiganti ang code.`,
        m31: `${profileNickname}, lumabas ka naman minsan, vitamin D.`,
        m32: `${profileNickname}, wag ka kabado, hindi ako AI… wait.`,
        m33: `gutom ka na ${profileNickname}? tara kain.`,
        m34: `${profileNickname}, what if nanaginip ka.`,
        m35: `${profileNickname}, cute mo pag stressed, char.`,
        m36: `${profileNickname}, wag masyado deep, shallow lang tayo.`,
        m37: `${profileNickname}, teka, bakit parang may pa-attitude ka?`,
        m38: `${profileNickname}, ganda ng aura mo today, wow.`,
        m39: `${profileNickname}, wag ka magpanic, aesthetic yan.`,
        m40: `${profileNickname}, halika dito, may sasabihin akong wala.`,
        m41: `${profileNickname}, chill, di mo kailangan i-prove lahat.`,
        m42: `${profileNickname}, pwede ka na magpahinga. promise.`,
        m43: `${profileNickname}, tagal mo magreply, ghoster vibes.`,
        m44: `${profileNickname}, wag ka mag-alala, papogi points yan.`,
        m45: `${profileNickname}, hoy, uminom ka ng tubig.`,
        m46: `${profileNickname}, ur data has bin hack.`,
        m47: `${profileNickname}, ikaw na smart, sige.`,
        m48: `${profileNickname}, wag sobra effort, sapat na yung ganda mo.`,
        m49: `${profileNickname}, lakas ng energy mo ah.`,
        m50: `${profileNickname}, teka, bakit ang gulo mo today?`,
        m51: `${profileNickname}, chill buddy, buhay pa tayo.`,
        m52: `${profileNickname}, wag ka malungkot, cute ka naman.`,
        m53: `${profileNickname}, laban lang HUHUHU.`,
        m54: `${profileNickname}, wag mo problemahin yung di ka naman mahal—char.`,
        m55: `${profileNickname}, okay ka lang da?`,
        m56: `${profileNickname}, kalma ka lang, hindi kita iiwan.`,
        m57: `${profileNickname}, pwede ka magbreak, hindi ka machine.`,
        m58: `${profileNickname}, ang seryoso mo, napapraning ako.`,
        m59: `${profileNickname}, magfanaw-fanaw na ako, bye.`,
        m60: `${profileNickname}, huwag ka magmadali, di mawawala yung mundo.`,
        m61: `${profileNickname}, chillax lang parang wala bukas.`,
        m62: `${profileNickname}, bakit parang ikaw may kasalanan?`,
        m63: `${profileNickname}, smile.`,
        m64: `${profileNickname}, pahinga ka muna, ang sipag mo eh.`,
        m65: `${profileNickname}, wag ka overthink, pangit yan.`,
        m66: `${profileNickname}, oy, relax ka lang.`,
        m67: `stay focused ${profileNickname}.`,
        m68: `${profileNickname}, teka, bakit ang gulo mo? cute.`,
        m69: `${profileNickname}, pwede na mag-snack time.`,
        m70: `${profileNickname}, when life give you lemon, take it.`,
        m71: `${profileNickname}, wag mo ako tignan ganyan, kinakabahan ako.`,
        m72: `${profileNickname}, okay ka lang? parang hindi.`,
        m73: `${profileNickname}, lumalakas ka, may buff?`,
        m74: `${profileNickname}, wag ka tense, hindi ka tinitiklop.`,
        m75: `${profileNickname}, tara lakad, kahit saan. in your dreams`,
        m76: `${profileNickname}, antok ka na no? HAHAHA`,
        m77: `${profileNickname}, wag na, ako na mag-iisip para sa'yo.`,
        m78: `${profileNickname}, kalma lang, di ka naman late sa buhay.`,
        m79: `${profileNickname}, magpahinga ka, para di ka ma-bad trip.`,
        m80: `${profileNickname}, uy, pa-cute ka nanaman.`,
        m81: `${profileNickname}, wag ka na mag-emote, ganda mo parin.`,
        m82: `${profileNickname}, relax boy, relax girl, relax ka.`,
        m83: `${profileNickname}, taas kilay mo ah, bakit?`,
        m84: `${profileNickname}, uy, hydrated ka ba?`,
        m85: `${profileNickname}, laban, para sa kape.`,
        m86: `${profileNickname}, mukha kang pagod, pero pretty.`,
        m87: `${profileNickname}, wag ka mag-rush, slow is smooth.`,
        m88: `${profileNickname}, tara, break time muna.`,
        m89: `${profileNickname}, wag ka masyado seryoso, di bagay.`,
        m90: `${profileNickname}, teka, bakit ang tahimik mo?`,
        m91: `${profileNickname}, ayos lang yan, pogi ka naman.`,
        m92: `${profileNickname}, relax, hindi ka sadboy today.`,
        m93: `${profileNickname}, wag mo masyado dibdibin, magaan lang yan.`,
        m94: `${profileNickname}, chill ka, may reward yan.`,
        m95: `${profileNickname}, Lamig sa Office.`,
        m96: `${profileNickname}, easy breezy ka lang.`,
        m97: `${profileNickname}, wag mo problemahin, meron ka pang snacks.`,
        m98: `${profileNickname}, stress kana? ako din.`,
        m99: `${profileNickname}, relax ka muna, lab u.`,
        m100: `${profileNickname}, smile, pogi points yan.`,
        m101: `You ready ${profileNickname}! Lets Go!`,
        m102: `Hoping you a good day ${profileNickname}.`,
        m103: `Focus ka lang sakin ${profileNickname}!`,
        m104: `Kaya muna ${profileNickname}, Fighting!`,
        m105: `Ready kana ${profileNickname}? Ano palag na?`,
        m106: `${profileNickname}? Never Kapuyon.`,
        m108: `Let's go! Let's go ${profileNickname}!`,
        m107: `Sarap mo ${profileNickname}!`,
        m109: `Here we go again ${profileNickname}! let's work`,
        m110: `let's finnish this ${profileNickname}!`,
        m111: `${profileNickname}! Kape muna.`,
        m112: `Pagud kana ${profileNickname}? mag C2 ka.`,
        m113: `${profileNickname}, chill lang.`,
        m114: `Never give up never back down.`,
        m115: `${profileNickname}, you got this.`,
        m116: `${profileNickname}, keep going.`,
        m117: `${profileNickname}, small steps count.`,
        m118: `${profileNickname}, progress is progress.`,
        m119: `${profileNickname}, believe in yourself.`,
        m120: `${profileNickname}, don’t stop now.`,
        m121: `${profileNickname}, you're getting better.`,
        m122: `${profileNickname}, stay focused.`,
        m123: `${profileNickname}, keep pushing.`,
        m124: `${profileNickname}, you’re stronger than you think.`,
        m125: `${profileNickname}, one day at a time.`,
        m126: `${profileNickname}, trust the process.`,
        m127: `${profileNickname}, keep your head up.`,
        m128: `${profileNickname}, you’re doing great.`,
        m129: `${profileNickname}, don't underestimate yourself.`,
        m130: `${profileNickname}, keep moving forward.`,
        m131: `${profileNickname}, you’re closer than you think.`,
        m132: `${profileNickname}, you can handle this.`,
        m133: `${profileNickname}, stay positive.`,
        m134: `${profileNickname}, proud of you already.`,
        m135: `${profileNickname}, Kumusta ang love life?`,
        m136: `${profileNickname}, nag break na kami nang AI gf ko.`,
        m137: `finally, nandito kana ${profileNickname}. Tara kape.`,
        m138: `Amoyin mo ang hangin ${profileNickname}`,
        m139: `${profileNickname}! umiinit ako.`,
        m140: `Hi ${profileNickname}!`,
        m141: `Never say never.`,
        m142: `Hello there! ${profileNickname}`,
        m143: `Good day! ${profileNickname}`,
        m144: `Hey, nice to see you!`,
        m145: `Hi ${profileNickname}, how’s everything?`,
        m146: `What’s up ${profileNickname}?`,
        m147: `Yo ${profileNickname}!`,
        m148: `Greetings ${profileNickname}!`,
        m149: `Hello, friend!`,
        m150: `let's get ready to rumble.`,
        m151: `Hiya!`,
        m152: `Long time no see!`,
        m153: `Good to have you back ${profileNickname}!`,
        m154: `Howdy!`,
        m155: `Hey ${profileNickname}, you’re looking great today!`,
        m156: `Hi ${profileNickname}, hope you're doing well!`,
        m157: `Nice to meet you!`,
        m158: `Pleasure seeing you again ${profileNickname}!`,
        m159: `Hey there, superstar!`,
        m160: `Warm greetings ${profileNickname}!`,
        m161: `Hi ${profileNickname}, ready to start the day?`,
        m162: `Good morning, ${profileNickname}!`,
        m163: `Rise and shine, ${profileNickname}!`,
        m164: `${profileNickname}, let's make today awesome!`,
        m165: `Hey ${profileNickname}, glad you're here!`,
        m166: `Welcome back, legend ${profileNickname}!`,
        m167: `Top of the day to you, ${profileNickname}!`,
        m168: `Hey ${profileNickname}, feeling motivated?`,
        m169: `${profileNickname}, let’s conquer the day!`,
        m170: `Hello again, ${profileNickname}!`,
        m171: `Great to see you, ${profileNickname}!`,
        m172: `Welcome, ${profileNickname}! Let's begin.`,
        m173: `Hi ${profileNickname}, ready for action?`,
        m174: `Yo ${profileNickname}! What's cookin'?`,
        m175: `Hey ${profileNickname}, let's smash those goals!`,
        m176: `Yo ${profileNickname}, try not to flop today.`,
        m177: `${profileNickname}, back again? Brave.`,
        m178: `Look who showed up—${profileNickname}, the chaos machine.`,
        m179: `${profileNickname}, try not to break anything this time.`,
        m180: `Sup ${profileNickname}? Don’t embarrass us today.`,
        m181: `${profileNickname}, ready to pretend you're productive?`,
        m182: `Oh wow, ${profileNickname} decided to appear.`,
        m183: `${profileNickname}, entering like a final boss with no stats.`,
        m184: `Hey ${profileNickname}, do your best… or at least try.`,
        m185: `${profileNickname}, let’s hope today’s better than yesterday.`,
        m186: `There they are—${profileNickname}, the legend of almost.`,
        m187: `Welcome back ${profileNickname}… we were *concerned*.`,
        m188: `${profileNickname}, don't worry, we lowered the bar for you.`,
        m189: `${profileNickname}, here to cause trouble again?`,
        m190: `Hi ${profileNickname}—still surviving? Impressive.`,
        m191: `${profileNickname}, let’s try not to rage quit today.`,
        m192: `Oh look, it’s ${profileNickname}, armed with confidence only.`,
        m193: `${profileNickname}, ready to fight your last two brain cells?`,
        m194: `Hey ${profileNickname}, let's make today less chaotic.`,
        m195: `${profileNickname}, please behave… just once.`,
        m196: `${profileNickname}, glad you made it… eventually.`,
        m197: `Yo ${profileNickname}, try not to disappoint yourself today.`,
        m198: `${profileNickname}, back at it with questionable decisions?`,
        m199: `${profileNickname}, let's hope your luck loads faster than you. Kidding`,
        m200: `${profileNickname}, welcome—don’t worry, I expect less.`,







    };

    const keys = Object.keys(messageText) as Array<keyof typeof messageText>;

    const messageKeys = Math.floor(Math.random() * keys.length);

    const randomMessage = messageText[keys[messageKeys]] ?? "";






    return (
        <>
            <Text style={{...styles.MessageFont, ...styles.messageAnimation}}>{randomMessage}</Text>
        </>
    );
}




