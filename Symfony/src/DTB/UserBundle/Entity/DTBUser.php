<?php

namespace DTB\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Entity\User as BaseUser;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Users
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\UserBundle\Entity\DTBUserRepository")
 */
class DTBUser extends BaseUser {

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    
    /**
     * @var string $description
     * 
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    protected $description;
    
    /**
     * @var string $firstName
     * 
     * @ORM\Column(name="firstName", type="string", length=255, nullable=true)
     */
    protected $firstName;
    
    /**
     * @var string $lastName
     * 
     * @ORM\Column(name="lastName", type="string", length=255, nullable=true)
     */
    protected $lastName;
    
    /**
     * @var string $city
     * 
     * @ORM\Column(name="city", type="string", length=255, nullable=true)
     */
    protected $city;
    
    /**
     * @var date $birthDate
     * 
     * @ORM\Column(name="birthDate", type="date", nullable=true)
     */
    protected $birthDate;
    
    /**
     * @var string $facebook
     * 
     * @ORM\Column(name="facebook", type="string", length=255, nullable=true)
     */
    protected $facebook;
    
    /**
     * @var string $twitter
     * 
     * @ORM\Column(name="twitter", type="string", length=255, nullable=true)
     */
    protected $twitter;
    
    /**
     * @var string $skype
     * 
     * @ORM\Column(name="skype", type="string", length=255, nullable=true)
     */
    protected $skype;
    
    /**
     * @ORM\OneToOne(targetEntity="DTB\UserBundle\Entity\ProfilePicture", cascade={"persist", "remove"})
     */
    private $profilePicture;
    /**
     * @ORM\OneToMany(targetEntity="DTB\BdBundle\Entity\BandeDessinee", mappedBy="creator")
     */
    private $bandesDessineesCreated;
    
    /**
     * @ORM\OneToMany(targetEntity="DTB\BdBundle\Entity\Candidature", mappedBy="user")
     */
    private $candidatures;
    
    /**
     * @ORM\ManyToMany(targetEntity="DTB\BdBundle\Entity\BandeDessinee", mappedBy="scenarists")
     */
    private $bandesDessineesScenarist;
    /**
     * @ORM\ManyToMany(targetEntity="DTB\BdBundle\Entity\BandeDessinee", mappedBy="drawers")
     */
    private $bandesDessineesDrawer;    
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return User
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     * @return User
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    
        return $this;
    }

    /**
     * Get firstName
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     * @return User
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    
        return $this;
    }

    /**
     * Get lastName
     *
     * @return string 
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set city
     *
     * @param string $city
     * @return User
     */
    public function setCity($city)
    {
        $this->city = $city;
    
        return $this;
    }

    /**
     * Get city
     *
     * @return string 
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set birthDate
     *
     * @param \DateTime $birthDate
     * @return User
     */
    public function setBirthDate($birthDate)
    {
        $this->birthDate = $birthDate;
    
        return $this;
    }

    /**
     * Get birthDate
     *
     * @return \DateTime 
     */
    public function getBirthDate()
    {
        return $this->birthDate;
    }

    /**
     * Set facebook
     *
     * @param string $facebook
     * @return User
     */
    public function setFacebook($facebook)
    {
        $this->facebook = $facebook;
    
        return $this;
    }

    /**
     * Get facebook
     *
     * @return string 
     */
    public function getFacebook()
    {
        return $this->facebook;
    }

    /**
     * Set twitter
     *
     * @param string $twitter
     * @return User
     */
    public function setTwitter($twitter)
    {
        $this->twitter = $twitter;
    
        return $this;
    }

    /**
     * Get twitter
     *
     * @return string 
     */
    public function getTwitter()
    {
        return $this->twitter;
    }

    /**
     * Set skype
     *
     * @param string $skype
     * @return User
     */
    public function setSkype($skype)
    {
        $this->skype = $skype;
    
        return $this;
    }

    /**
     * Get skype
     *
     * @return string 
     */
    public function getSkype()
    {
        return $this->skype;
    }
    
    /**
     * Set profilePicture
     *
     * @param \DTB\UserBundle\Entity\ProfilePicture $profilePicture
     * @return User
     */
    public function setProfilePicture(\DTB\UserBundle\Entity\ProfilePicture $profilePicture = null) {
        $this->profilePicture = $profilePicture;

        return $this;
    }

    /**
     * Get profilePicture
     *
     * @return \DTB\UserBundle\Entity\ProfilePicture 
     */
    public function getProfilePicture() {
        return $this->profilePicture;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->bandesDessineesCreated = new \Doctrine\Common\Collections\ArrayCollection();
        $this->bandesDessineesScenarist = new \Doctrine\Common\Collections\ArrayCollection();
        $this->bandesDessineesDrawer = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add bandesDessineesCreated
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessineesCreated
     * @return DTBUser
     */
    public function addBandesDessineesCreated(\DTB\BdBundle\Entity\BandeDessinee $bandesDessineesCreated)
    {
        $this->bandesDessineesCreated[] = $bandesDessineesCreated;
    
        return $this;
    }

    /**
     * Remove bandesDessineesCreated
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessineesCreated
     */
    public function removeBandesDessineesCreated(\DTB\BdBundle\Entity\BandeDessinee $bandesDessineesCreated)
    {
        $this->bandesDessineesCreated->removeElement($bandesDessineesCreated);
    }

    /**
     * Get bandesDessineesCreated
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getBandesDessineesCreated()
    {
        return $this->bandesDessineesCreated;
    }

    /**
     * Add bandesDessineesScenarist
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessineesScenarist
     * @return DTBUser
     */
    public function addBandesDessineesScenarist(\DTB\BdBundle\Entity\BandeDessinee $bandesDessineesScenarist)
    {
        $this->bandesDessineesScenarist[] = $bandesDessineesScenarist;
    
        return $this;
    }

    /**
     * Remove bandesDessineesScenarist
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessineesScenarist
     */
    public function removeBandesDessineesScenarist(\DTB\BdBundle\Entity\BandeDessinee $bandesDessineesScenarist)
    {
        $this->bandesDessineesScenarist->removeElement($bandesDessineesScenarist);
    }

    /**
     * Get bandesDessineesScenarist
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getBandesDessineesScenarist()
    {
        return $this->bandesDessineesScenarist;
    }

    /**
     * Add bandesDessineesDrawer
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessineesDrawer
     * @return DTBUser
     */
    public function addBandesDessineesDrawer(\DTB\BdBundle\Entity\BandeDessinee $bandesDessineesDrawer)
    {
        $this->bandesDessineesDrawer[] = $bandesDessineesDrawer;
    
        return $this;
    }

    /**
     * Remove bandesDessineesDrawer
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessineesDrawer
     */
    public function removeBandesDessineesDrawer(\DTB\BdBundle\Entity\BandeDessinee $bandesDessineesDrawer)
    {
        $this->bandesDessineesDrawer->removeElement($bandesDessineesDrawer);
    }

    /**
     * Get bandesDessineesDrawer
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getBandesDessineesDrawer()
    {
        return $this->bandesDessineesDrawer;
    }

    /**
     * Add candidatures
     *
     * @param \DTB\BdBundle\Entity\Candidature $candidatures
     * @return DTBUser
     */
    public function addCandidature(\DTB\BdBundle\Entity\Candidature $candidatures)
    {
        $this->candidatures[] = $candidatures;
    
        return $this;
    }

    /**
     * Remove candidatures
     *
     * @param \DTB\BdBundle\Entity\Candidature $candidatures
     */
    public function removeCandidature(\DTB\BdBundle\Entity\Candidature $candidatures)
    {
        $this->candidatures->removeElement($candidatures);
    }

    /**
     * Get candidatures
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCandidatures()
    {
        return $this->candidatures;
    }
}