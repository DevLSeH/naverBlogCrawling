import axios from "axios";
import cheerio from "cheerio";

interface blogBody {
    postBody: String,
    postImgUrl: URL

};

const blogBodys = async (firstUrl: string) => {
//게시물에 접근할 수 있는 진짜 url을 얻는다
    const url = firstUrl.toString();
    const urlParse = url.split('/');
    const blogId = urlParse[3];
    const postId = urlParse[4];

    const originUrl = `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${postId}&redirect=Dlog&widgetTypeCall=true&directAccess=false`;

    axios({
        
        url: originUrl,
        method: "GET",
    })
        .then(response => {
            const data = response.data;
            const $ = cheerio.load(data);
            // const $title = $("p.se-text-paragraph");
            // const title = $title.find("se-fs-").text();
            // console.log(title);
            // console.log("\n");

            const $body = $("p.se-text-paragraph");
            const body = $body.find("span").text();
            console.log(body);

            const $img = $("a.se-module-image-link");
            const rawImg = $img.find("img").attr("src") || "";
            const img = rawImg.replace("type=w80_blur", "type=w966");
            console.log(img);

            const blogBody : blogBody = {
                postBody: body,
                postImgUrl: new URL(img)
            };

            console.log(blogBody);

            return blogBody;

        })
        .catch(err => {
            console.error(err);
        });
};

blogBodys("https://blog.naver.com/xhxhdhkalvl/223082141184");