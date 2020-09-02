document.addEventListener('DOMContentLoaded', () => {
    const getUrlLikes = "http://localhost:3000/quotes?_embed=likes"
    const getUrl = "http://localhost:3000/quotes"
    const quoteList = document.getElementById('quote-list')
    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', (e) => handleForm(e))

    function getQuotes() {
        quoteList.innerHTML = ""
        return fetch(getUrlLikes)
            .then(res => res.json())
    }
    getQuotes().then(quotes => renderQuotes(quotes))

    function renderQuotes(quotes) {
        quoteList.innerHTML = ""
        quotes.forEach((quote, quoteIndex) => {
            let li = document.createElement('li')
            li.className = 'quote-card'
            li.setAttribute('data-id', quote.id)
            let block = document.createElement('blockquote')
            block.className = 'blockquote'
            let p = document.createElement('p')
            p.className = 'mb-0'
            p.innerText = quote.quote
            let footer = document.createElement('footer')
            footer.className = 'blockquote-footer'
            footer.innerText = quote.author
            let br = document.createElement('br')
            let likeBtn = document.createElement('button')
            likeBtn.id = `L${quote.id}`
            likeBtn.className = 'btn-success'
            likeBtn.innerText = "Likes: "
            let span = document.createElement('span')
            span.innerText = quote.likes.length
            likeBtn.append(span)
            likeBtn.addEventListener("click", () => handleLikeBtn(quote))
            let delBtn = document.createElement('button')
            delBtn.innerText = 'Delete'
            delBtn.addEventListener('click', (e) => {
                quotes.splice(quoteIndex, 1);
                fetch(`${getUrl}/${quote.id}`, {
                    method: 'DELETE'
                }),
                    renderQuotes(quotes);
            })
            //delBtn.addEventListener("click", () => )
            block.append(p, footer, br, likeBtn, delBtn)
            li.append(block)
            quoteList.append(li)
        })
    }

    function handleForm(e) {
        e.preventDefault()
        let quoteText = e.target["quote"].value
        let quoteAuth = e.target["author"].value
        let quoteLikes = []
        let quoteData = {
            quote: quoteText,
            author: quoteAuth,
            likes: quoteLikes
        }
        console.log(quoteData)
        postForm(quoteData)
        form.reset()
    }

    function postForm(quoteData) {
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify(quoteData)
        }
        return fetch(getUrl, configObj)
            .then(res => res.json())
            .then(quotes => renderQuotes(quotes))
    }

    function handleLikeBtn(quote) {
        // console.log('like button connected')
        // console.log(quote.id)
        let quoteId = quote.id
        let quoteLikes = quote.likes
        console.log(quote.likes)
        quoteLikes.push({ quoteId: quoteId })
        console.log(quoteLikes)
        patchLike(quoteId, quoteLikes)
    }

    function patchLike(quoteId, quoteLikes) {
        console.log("patch like connected")
        console.log(quoteLikes)
        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                likes: quoteLikes
            })
        }
        return fetch(`${getUrl}/${quoteId}`, configObj)
            .then(res => res.json())
            .then(quote => document.getElementById(`L${quoteId}`).lastChild.innerText = quote.likes.length)
        // document.getElementById(`L${quoteId}`).firstChild.innerText = quoteLikes.length)

    }

    // function handleDelete(quote){
    //     console.log('BALETED')
    //     console.log(quote.id)
    //     let quoteId = quote.id
    //     fetch(`${getUrl}/${quoteId}`, {
    //         method: 'DELETE'
    //     }).then(getQuotes().then(quotes => quotes.forEach(quote => renderQuote(quote))))
    // }






})