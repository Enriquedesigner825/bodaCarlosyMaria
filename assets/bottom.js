const btn_scrolltop = document.getElementById("btn_scrolltop")
btn_scrolltop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})
window.onscroll = () => {
        add_btn_scrolltop()
    }
    const add_btn_scrolltop = () => {
        if(window.scrollY < 300){
            btn_scrolltop.classList.remove("btn-scrolltop-on")
        }else{
            btn_scrolltop.classList.add("btn-scrolltop-on")
        }
    }