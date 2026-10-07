import { test, expect } from '@playwright/test'


const BASE_URL = "https://restful-booker.herokuapp.com/booking"

test("Create booking", async ({ request }) => {

    const request_payload = {
        "firstname": "Bikram",
        "lastname": "Saha",
        "totalprice": 555,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2026-10-05",
            "checkout": "2026-10-29"
        },
        "additionalneeds": "Breakfast"
    }

    const response = await request.post(`${BASE_URL}`, { data: request_payload })
    const response_body = await response.json()

    console.log(response_body)

    // validating the response
    expect(response.status()).toBe(200)

    expect(response.statusText()).toBe("OK")

    //validating response body

    expect(response_body).toHaveProperty("bookingid")
    expect(response_body).toHaveProperty("booking")
    expect(response_body.bookingid).toEqual(expect.any(Number))

    const booking = await response_body.booking
    expect(booking).toMatchObject(request_payload)
    expect(booking.bookingdates).toMatchObject(
        { checkin: '2026-10-05', checkout: '2026-10-29' }
    )
})