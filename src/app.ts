import axios from "axios";
import cheerio from "cheerio";

interface blogBody {
    postBody: String,
    postImgUrl: URL

};

const blogBodys = async (firstUrl: string) => {
    const url = firstUrl.toString();
    const urlParse = url.split("/");
    const blogId = urlParse[3];
    const postId = urlParse[4];

    const originUrl = `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${postId}&redirect=Dlog&widgetTypeCall=true&directAccess=false`;
    const tagUrl = `https://blog.naver.com/BlogTagListInfo.naver?blogId=${blogId}&logNoList=${postId}&logType=mylog`
    const visitorUrl = `https://blog.naver.com/NVisitorgp4Ajax.naver?blogId=${blogId}`;

    const res1 = await axios.get(originUrl);
    const res2 = await axios.get(tagUrl);
    const res3 = await axios.get(visitorUrl);

    const data = res1.data;
    const tagData = res2.data;
    const tags = decodeURI(tagData.taglist[0].tagName);
    const visitorData = res3.data;

    const list: (string | undefined)[] = [];
    const $visitcnt = cheerio.load(visitorData);
    const visitors = $visitcnt("visitorcnt").toArray().map(element => element.attribs);
    const visitor = visitors.map(element => Number(element.cnt))
    console.log(visitor);
    console.log(visitor.sort(function (a, b) {
        return b - a;
    }));



    const $ = cheerio.load(data);
    // const $title = $("p.se-text-paragraph");
    // const title = $title.find("se-fs-").text();
    // console.log(title);
    // console.log("\n");

    const $body = $("p.se-text-paragraph");
    const body = $body.find("span").text();

    const $img = $("a.se-module-image-link");
    const rawImg = $img.find("img").attr("src") || "";
    const img = rawImg.replace("type=w80_blur", "type=w966");

    const blogBody = {
        postBody: body,
        postImgUrl: img,
        visitor: visitor,
    };
    return blogBody;


    ///
    axios.all([axios.get(originUrl), axios.get(tagUrl)])
        .then(
            axios.spread((res1, res2) => {
                const data = res1.data;
                const tagData = res2.data;
                const tags = decodeURI(tagData.taglist[0].tagName);

                console.log(tags);

                const $ = cheerio.load(data);
                // const $title = $("p.se-text-paragraph");
                // const title = $title.find("se-fs-").text();
                // console.log(title);
                // console.log("\n");

                const $body = $("p.se-text-paragraph");
                const body = $body.find("span").text();

                const $img = $("a.se-module-image-link");
                const rawImg = $img.find("img").attr("src") || "";
                const img = rawImg.replace("type=w80_blur", "type=w966");

                const blogBody = {
                    postBody: body,
                    postImgUrl: img
                };
                return blogBody;

            }))
        .catch(err => {
            console.error(err);
        });

};


//     axios({
//         //<iframe> 속의 src 링크에 "https://blog.naver.com" 추가하여 url 입력
//         url: originUrl,
//         method: "GET",
//     })
//         .then(response => {
//             const data = response.data;
//             const $ = cheerio.load(data);
//             // const $title = $("p.se-text-paragraph");
//             // const title = $title.find("se-fs-").text();
//             // console.log(title);
//             // console.log("\n");

//             const $body = $("p.se-text-paragraph");
//             const body = $body.find("span").text();

//             const $img = $("a.se-module-image-link");
//             const rawImg = $img.find("img").attr("src") || "";
//             const img = rawImg.replace("type=w80_blur", "type=w966");

//             const blogBody = {
//                 postBody: body,
//                 postImgUrl: img
//             };
//             return blogBody;

//         })
//         .catch(err => {
//             console.error(err);
//         });

blogBodys("https://blog.naver.com/dicagallery/223062174988");